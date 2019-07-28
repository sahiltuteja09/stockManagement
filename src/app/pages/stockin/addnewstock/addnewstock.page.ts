import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';

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
  constructor(
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
      'image':''
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
        if(this.imageName){
          this.stock.image = this.imageName;
          console.log('this.imageName if '+this.imageName);
        }
       
      console.log('this.imageName '+this.imageName);
        this.isLoadingSubscriber.unsubscribe();
        if (typeof this.croppedImagepathSubscriber == 'object')
          this.croppedImagepathSubscriber.unsubscribe();
      });
    }

    this.uploadImage.pickImage();
  }

  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();
    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();
  }

}
