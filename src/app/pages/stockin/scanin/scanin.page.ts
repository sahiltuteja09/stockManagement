import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ScannerService } from 'src/app/providers/scanner.service';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../../auth/authentication.service';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-scanin',
  templateUrl: './scanin.page.html',
  styleUrls: ['./scanin.page.scss'],
  animations: [
    trigger('panelInOut', [
        transition('void => *', [
            style({transform: 'translateY(-100%)'}),
            animate(800)
        ]),
        // transition('* => void', [
        //     animate(100, style({transform: 'translateY(100%)'}))
        // ])
    ]),
]
})
export class ScaninPage implements OnInit {

  isMobileDevice: boolean = true;
defaultImage:string = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
img_base: string = CoreConfigConstant.uploadedPath;
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
  scannerbarCode;
  inFiniteLoop:boolean = false;
  products:any = [];
  product_image:string = '';
  availableQuantity:number = 0;
  // isFlashEnable: boolean = false;
  // isScaning: boolean = false;
  // flashIcon: string = 'flash';
  // scannerPermission: boolean = true;

  // scannerPermissionSubscriber;
  // isScaningSubscriber;
  // scanedTextSubscriber;

  queryParmSub: any;

  public updatestockdetail: FormGroup;

  defaultSelecteType= '3';
  compareWithType : any ;
  defaultSelecteMerchant = '1';
  compareWithMerchant : any ;
  purchaseCost:number = 0;
  selectedProductId:number = 0;
  hideProductCard:boolean =true;
  selectedProductTitle:string ='';
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
      product_id: new FormControl(),
      sale_price: new FormControl(),
    });

    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'];
    });
    this.getStockType();
    this.getMerchants();

    this.compareWithType = this.compareWithFn;
    this.compareWithMerchant = this.compareWithMerchantFn;
  }
  compareWithFn(o1, o2) {
    return o1 === o2;
  }
  compareWithMerchantFn(o1, o2) {
    return o1 === o2;
  }
  ionViewWillEnter() {
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
                this.noDataFound = data.msg;
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

  updateStock(quantity, productId, product_status_id, marketplace_id, reason, noUIDFOUND?:number, sale_price?:any) {

    if (quantity > 0) {
      if (product_status_id == '') {
        this.appProvider.showToast('Stock type is required.');
        return;
      }
      if(productId == '' || productId == undefined){
        this.appProvider.showToast('Invalid product!! Please select a product.');
        return;
      }
      let stock = { 'save_to_product_uids': 0, 'quantity': quantity, 'id': productId, 'product_status_id': product_status_id, 'marketplace_id': marketplace_id, 'stockType': 1, 'reason': reason, 'sale_price':sale_price }
      
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
                console.log('complete');
              }
            );
        });
      });
    } else {
      this.appProvider.showToast('Quantity field must be greater than zero.');
    }
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
  // setProductView(product:any){
  //   console.log(product);
  //   this.availableQuantity = product.detail.value.quantity;
  //   this.product_image = product.detail.value.image;
  //   this.purchaseCost = product.detail.value.purchase_cost;
  // }
  resetProductView(){
    this.availableQuantity =0;
    this.product_image = '';
    this.purchaseCost = 0;
  }
  selectedProduct(product:any){
    this.selectedProductId = product.id;
    
    this.availableQuantity = product.quantity;
        this.product_image = product.image;
        this.purchaseCost = product.purchase_cost;
    this.selectedProductTitle = product.title;this.hideProductCard = false;
    setTimeout(() => {
      
    }, 200);
      }
      undoSelectedProduct(){
        this.hideProductCard = true;
        this.selectedProductId = 0;
      }

  // scanCode() {
  //   if (!this.appProvider.isMobile()) { return false; }

  //   if (typeof this.scannerPermissionSubscriber != 'object') {
  //     this.scannerPermissionSubscriber = this.scanService.scannerPermission.subscribe((data) => {
  //       this.scannerPermission = data;
  //     });
  //   }
  //   if (typeof this.isScaningSubscriber != 'object') {
  //   this.isScaningSubscriber = this.scanService.isScaning.subscribe((data) => {
  //     this.isScaning = data;
  //   });
  // }
  //   this.scanedTextSubscriber = this.scanService.scanedText.subscribe((data) => {
  //     if (data) {
  //       this.scanService.setScaningFlag();
  //       if (typeof this.scannerPermissionSubscriber == 'object')
  //         this.scannerPermissionSubscriber.unsubscribe();

  //       this.scanedTextSubscriber.unsubscribe();
  //       this.searchTerm = data;
  //       this.searchProduct();
  //     }
  //   });
  //   this.searchTerm = '';
  //   this.scanService.scanCode();
  // }

  // hideCamera() {
  //   this.scanService.setScaningFlag();
  //  // this.flashIcon = this.scanService.hideCamera(this.isFlashEnable);
  // }
  // openFlash() {
  //   this.isFlashEnable = !this.isFlashEnable;
  //  // this.flashIcon = this.scanService.openFlash(this.isFlashEnable);
  // }
  // openSetting() {
  //   this.scanService.openSetting();
  // }
  ionViewWillLeave() {
    // this.scanService.setScaningFlag();
    // if (typeof this.scannerPermissionSubscriber == 'object')
    //   this.scannerPermissionSubscriber.unsubscribe();
    // if (typeof this.isScaningSubscriber == 'object')
    //   this.isScaningSubscriber.unsubscribe();
    // if (typeof this.scanedTextSubscriber == 'object')
    //   this.scanedTextSubscriber.unsubscribe();

    //   this.scanService.distroyScaner();

      if(typeof this.queryParmSub == 'object')
      this.queryParmSub.unsubscribe();

      if (typeof this.scannerbarCode == 'object') {
        this.scanService.emptyText();
        this.scannerbarCode.unsubscribe();
        
      }

        this.appProvider.dismissLoading();
      

  }
}
