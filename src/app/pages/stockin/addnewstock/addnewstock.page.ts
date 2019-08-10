import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ScannerService } from 'src/app/providers/scanner.service';

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

  isLoading: boolean = false;
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  public newstockdetail: FormGroup;



  isFlashEnable: boolean = false;
  isScaning: boolean = false;
  flashIcon: string = 'flash';
  scannerPermission: boolean = true;

  scannerPermissionSubscriber;
  isScaningSubscriber;
  scanedTextSubscriber;

  isMobileDevice: boolean = true;
  constructor(
    private scanService: ScannerService,
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService
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
  }
  ionViewWillEnter() {
    this.isMobileDevice = this.appProvider.isMobile();
  }
  ngOnInit() {
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
          this.curdService.postData('save_product', this.stock)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.newstockdetail.reset();
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



  scanCode(codeType) {
    if (!this.appProvider.isMobile()) { return false; }

    if (typeof this.scannerPermissionSubscriber != 'object') {
      this.scannerPermissionSubscriber = this.scanService.scannerPermission.subscribe((data) => {
        this.scannerPermission = data;
      });
    }
    if (typeof this.isScaningSubscriber != 'object') {
      this.isScaningSubscriber = this.scanService.isScaning.subscribe((data) => {
        this.isScaning = data;
      });
    }
    this.scanedTextSubscriber = this.scanService.scanedText.subscribe((data) => {
      if (data) {
        this.scanService.setScaningFlag();
        if (typeof this.scannerPermissionSubscriber == 'object')
          this.scannerPermissionSubscriber.unsubscribe();

        this.scanedTextSubscriber.unsubscribe();
        switch(codeType){
          case 'product_unique':
              this.stock.product_unique = data;
              break;
              case 'amazon_asin':
                  this.stock.amazon = data;
                break;
              case 'flipkart_asin':
                  this.stock.flipkart = data;
                break;
              case 'paytm_asin':
                  this.stock.paytm = data;
                break;
              case 'other_uid':
                  this.stock.other_uid = data;
                break;
        }
        
      }
    });
    this.scanService.scanCode();
  }

  hideCamera() {
    this.scanService.setScaningFlag();
    this.flashIcon = this.scanService.hideCamera(this.isFlashEnable);
  }
  openFlash() {
    this.isFlashEnable = !this.isFlashEnable;
    this.flashIcon = this.scanService.openFlash(this.isFlashEnable);
  }
  openSetting() {
    this.scanService.openSetting();
  }
  ionViewWillLeave() {
    this.scanService.setScaningFlag();
    if (typeof this.scannerPermissionSubscriber == 'object')
      this.scannerPermissionSubscriber.unsubscribe();
    if (typeof this.isScaningSubscriber == 'object')
      this.isScaningSubscriber.unsubscribe();
    if (typeof this.scanedTextSubscriber == 'object')
      this.scanedTextSubscriber.unsubscribe();

    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();
    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();
this.hideCamera();
    this.scanService.distroyScaner();

  }

}
