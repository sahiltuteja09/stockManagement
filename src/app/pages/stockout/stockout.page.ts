import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from 'src/app/providers/scanner.service';
import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-stockout',
  templateUrl: './stockout.page.html',
  styleUrls: ['./stockout.page.scss'],
})
export class StockoutPage implements OnInit {
  searchTerm: string = "";
  searching: boolean = false;
  searchControl: FormControl;
  searchApi: string = 'searchByKeyword';
  page: number = 1;
  searchData: any = [];
  noDataFound: string = 'Please enter the keyword or scan qr to search.';

  stock: any;
  stockStatus: any = [];
  isStockStatusFetched: boolean = false;

  merchants: any = [];
  isMerchantFetched: boolean = false;
  public updatestockdetail: FormGroup;

  queryParmSub: any;

  isMobileDevice: boolean = true;
  defaultImage:string = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  img_base: string = CoreConfigConstant.uploadedPath;

  scannerbarCode;
  availableQuantity:number = 0;
  product_image:string = '';
  inFiniteLoop:boolean = false;
  products:any = [];
  constructor(
    private scanService: ScannerService,
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
    private route: ActivatedRoute, 
    public authenticationService: AuthenticationService) { 
      
    const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';
    this.searchControl = new FormControl();
    this.updatestockdetail = new FormGroup({
      quantity: new FormControl(),
      product_status_id: new FormControl(),
      marketplace_id: new FormControl(),
      product_id: new FormControl()
    });
    
    this.getStockType();
    this.getMerchants();
  }
  ionViewWillEnter() {
    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'];
      console.log('ionViewWillEnter '+this.searchTerm);
    });
    this.isMobileDevice = this.appProvider.isMobile();
  }
  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(2000)).subscribe(value => { this.searching = false; this.searchProduct() });
  }
  setFilteredItems() {
    this.searching = true;
  }
  searchProduct() {
    if (this.searchTerm) {
      this.inFiniteLoop = false;
      this.page = 1;
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          if (!this.isStockStatusFetched) {
            this.getStockType();
          }
          if (!this.isStockStatusFetched) {
            this.getMerchants();
          }
          let param = { 'page': this.page, 'term': this.searchTerm };
          this.curdService.getData(this.searchApi, param)
            .subscribe((data: any) => {
              if (data.status == false) {
                // no product found
                this.noDataFound = data.msg;console.log(this.products);
                this.searchData = [];
                if(Object.keys(this.products).length === 0){
                  this.getProductsList();
                }
              } else {
                this.searchData = data;
                this.page = this.page + 1;
              }

              this.appProvider.dismissLoading();
            },
              error => {
                this.appProvider.showToast(error);
                this.appProvider.dismissLoading();
              }
            );
        });
      });
    } else {
      this.searchData = [];
    }
  }
  doInfinite(infiniteScroll) {
    this.inFiniteLoop = true;
    this.noDataFound = '';
    setTimeout(() => {
      let param = { 'page': this.page, 'term': this.searchTerm };
      this.curdService.getData(this.searchApi, param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.searchData.data.push(result.data[i]);
              }
              this.page = this.page + 1;
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
      infiniteScroll.target.complete();
    }, 2000);
  }

  updateStock(quantity, productId, product_status_id, marketplace_id, reason, noUIDFOUND?:number) {
    if (quantity > 0) {
      if (product_status_id == '') {
        this.appProvider.showToast('Stock type is required.');
        return;
      }

      let stock = {'save_to_product_uids': 0, 'quantity': quantity, 'id': productId, 'product_status_id': product_status_id, 'marketplace_id': marketplace_id, 'stockType': 2, 'reason': reason }
     
      if(noUIDFOUND == 1){
        if (marketplace_id == '') {
          this.appProvider.showToast('Please select the merchant.');
          return;
        }
        let product_uids_type = {'save_to_product_uids': 1, 'marketplace_unique_id' : this.searchTerm}; 
        stock = {...stock , ...product_uids_type};
      }
     
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          this.curdService.postData('updateStock', stock)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.updatestockdetail.reset();
              } else {
                this.appProvider.showToast(data.msg);
              }
              setTimeout(() => {
                this.appProvider.dismissLoading();
                if (data.status){
                  if(typeof this.queryParmSub == 'object')
                      this.queryParmSub.unsubscribe();
                      
                      this.searchTerm = '';
                  this.appProvider.goto('myproducts',1);
                }
                
              }, 2000);

            },
              error => {
                this.appProvider.showToast(error);
                this.appProvider.dismissLoading();
              },
              () => {
              }
            );
        });
      });
    } else {
      this.appProvider.showToast('Quantity field must be greater than zero.');
    }
  }

  getProductsList() {
    this.curdService.getData('myProductsList')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.products = [];
          } else {
            this.products = data;
          }
        },
        error => {
        }
      );
  }

  getStockType() {
    this.curdService.getData('getProductStatus')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
            this.isStockStatusFetched = false;
          } else {
            this.isStockStatusFetched = true;
            this.stockStatus = data;
          }
        },
        error => {
          this.isStockStatusFetched = false;
        }
      );
  }
  getMerchants() {
    this.curdService.getData('getMerchants')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
            this.isStockStatusFetched = false;
          } else {
            this.isStockStatusFetched = true;
            this.merchants = data;
          }
        },
        error => {
          this.isStockStatusFetched = false;
        }
      );
  }

  scanCode(){
    if (!this.appProvider.isMobile()) { return false; }

      if (typeof this.scannerbarCode != 'object') {
        this.scannerbarCode = this.scanService.barCodeText.subscribe((data) => {
          
          if(data.status){

            this.searchTerm = data.msg;
         this.searchProduct();
          }else{
            if(data.msg != ''){
              this.appProvider.showToast(data.msg);
            }
          }
  
        });
      }
      this.searchTerm = '';
      this.scanService.scanBarCode();
  
  }
  setProductView(product:any){
    console.log(product);
    this.availableQuantity = product.detail.value.quantity;
    this.product_image = product.detail.value.image;
  }
  ionViewWillLeave() {
    if(typeof this.queryParmSub == 'object')
      this.queryParmSub.unsubscribe();

      if (typeof this.scannerbarCode == 'object') {
        this.scanService.emptyText();
        this.scannerbarCode.unsubscribe();
        
      }
      this.searchTerm = '';
        this.appProvider.dismissLoading();
        console.log('ionViewWillLeave');
  }
  ngOnDestroy(){
    this.searchTerm = '';
    if(typeof this.queryParmSub == 'object')
      this.queryParmSub.unsubscribe();

      console.log('ngOnDestroy');

  }
}
