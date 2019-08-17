import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ScannerService } from 'src/app/providers/scanner.service';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigConstant } from 'src/configconstants';

interface Stock {
  product_unique: string;
  product_name: string;
  other_uid: string;
  amazon: string;
  description: string;
  flipkart: string;
  paytm: string;
  product_qty: number;
  purchase_cost: number;
  image: string;
}

@Component({
  selector: 'app-addnewstock',
  templateUrl: './addnewstock.page.html',
  styleUrls: ['./addnewstock.page.scss'],
})
export class AddnewstockPage implements OnInit {
  stock: Stock = <Stock>{};

  @ViewChild('productUnique') productUnique : string;

  isLoading: boolean = false;
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  public newstockdetail: FormGroup;

  isMobileDevice: boolean = true;
  scannerbarCode;

  routSub: any;
  product_id: number = 0;
  scanType:string = '';
  constructor(
    private scanService: ScannerService,
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService,
    private route: ActivatedRoute
  ) {


    this.stock = {
      'product_unique': '',
      'product_name': '',
      'other_uid': '',
      'amazon': '',
      'description': '',
      'flipkart': '',
      'paytm': '',
      'product_qty': 0,
      'purchase_cost': 0,
      'image': ''
    }
    this.stock.image = 'hello';
    this.newstockdetail = formBuilder.group({
      product_unique: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      purchase_cost: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      product_qty: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      product_name: ['', Validators.compose([Validators.maxLength(80), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(200)])],
      amazon: ['', Validators.compose([Validators.maxLength(30)])],
      flipkart: ['', Validators.compose([Validators.maxLength(30)])],
      paytm: ['', Validators.compose([Validators.maxLength(30)])],
      other_uid: ['', Validators.compose([Validators.maxLength(30)])],
      image: [this.imageName]
    });

    this.routSub = this.route.params.subscribe((params) => {
      this.product_id = +params['product_id'];

    });
    
  }
  ionViewWillEnter() {
    this.isMobileDevice = this.appProvider.isMobile();
  }
  ngOnInit() {

    if (this.product_id > 0) {
      this.getProductDetail();
    }
  }
  getProductDetail() {

    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let productId = { 'product_id': this.product_id };
        this.curdService.getData('getProduct', productId)
          .subscribe((data: any) => {

            if (data.status) {

              this.stock = {
                'product_unique': data.ids.app_unique,
                'product_name': data.data.title,
                'other_uid': data.ids.other_uid,
                'amazon': data.ids.amazon,
                'description': data.data.description,
                'flipkart': data.ids.flipkart,
                'paytm': data.ids.paytm,
                'product_qty': data.data.quantity,
                'purchase_cost': data.data.purchase_cost,
                'image': data.data.image
              },
                this.croppedImagepath = CoreConfigConstant.uploadedPath + data.data.image;

            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {
              this.appProvider.dismissLoading();
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
  }
  // get the form contorls in a f object
  get f() { return this.newstockdetail.controls; }
  newStock() {

    if (!this.newstockdetail.valid) {
      console.log('form');
      return;
    }
    else {

      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          let apiMethod = 'save_product';
          let merged;
          let updateStock;
          if (this.product_id > 0) {
            apiMethod = 'update_product';
            updateStock = { 'id': this.product_id };
          }else{
            updateStock = { 'id': 0};
          }
          merged = { ...updateStock, ...this.stock };

          this.curdService.postData(apiMethod, merged)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.newstockdetail.reset();
                if(this.product_id > 0){
                  this.appProvider.goto('addnewstock');
                }
                
              } else {
                this.appProvider.showToast(data.msg);
              }
              setTimeout(() => {
                this.appProvider.dismissLoading();
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
    }
  }

  pickImage() {

    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        this.isLoading = data;
      });
    }
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
        this.croppedImagepath = data;
        this.imageName = this.uploadImage.imageFileName();
        if (this.imageName) {
          this.stock.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);
        }

        console.log('this.imageName ' + this.imageName);
        this.isLoadingSubscriber.unsubscribe();
        if (typeof this.croppedImagepathSubscriber == 'object')
          this.croppedImagepathSubscriber.unsubscribe();
      });
    }

    this.uploadImage.pickImage();
  }


scanCode(codeType){
  if (!this.appProvider.isMobile()) { return false; }

this.scanType =  codeType;
    if (typeof this.scannerbarCode != 'object') {
      this.scannerbarCode = this.scanService.barCodeText.subscribe((data) => {
        console.log(data);
        if(data.status){
          console.log(this.scanType);
      switch (this.scanType) {
            case 'product_unique':
             this.stock.product_unique = data.msg;
             //self.productUnique = data;
              break;
            case 'amazon_asin':
              this.stock.amazon = data.msg;
              break;
            case 'flipkart_asin':
              this.stock.flipkart = data.msg;
              break;
            case 'paytm_asin':
              this.stock.paytm = data.msg;
              break;
            case 'other_uid':
              this.stock.other_uid = data.msg;
              break;
          }
          
        }else{
          if(data.msg != ''){
            this.appProvider.showToast(data.msg);
          }
        }

      });
    }

    this.scanService.scanBarCode();

}
  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();

    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();

    if (typeof this.routSub == 'object')
      this.routSub.unsubscribe();
   
      if (typeof this.scannerbarCode == 'object') {
        this.scanService.emptyText();
        this.scannerbarCode.unsubscribe();
        
      }

  }

}
