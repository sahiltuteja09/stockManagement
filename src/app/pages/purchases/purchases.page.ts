import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigConstant } from 'src/configconstants';


interface Purchases {
  image: string;
  totalcost: number;
  description: string;
  purchase_date:string
}

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {
  purchase: Purchases = <Purchases>{};
  isLoading: boolean = false;
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  public newstockdetail: FormGroup;

  isMobileDevice: boolean = true;

  routSub: any;
  purchase_id: number = 0;
  scanType:string = '';
  constructor(
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService,
    private route: ActivatedRoute
  ) {

    this.purchase = {
      'totalcost': 0,
      'image': '',
      'description': '',
      'purchase_date':''
    };

    this.newstockdetail = formBuilder.group({
      purchase_date: ['', Validators.compose([Validators.required])],
      totalcost: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      image: [this.imageName],
      description: ['', Validators.compose([Validators.maxLength(200)])]
    });

    this.routSub = this.route.params.subscribe((params) => {
      this.purchase_id = +params['purchase_id'];

    });

   }
   ionViewWillEnter() {
    this.isMobileDevice = this.appProvider.isMobile();
  }

  ngOnInit() {
    if (this.purchase_id > 0) {
      this.getDetail();
    }
  }
  getDetail() {

    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let productId = { 'purchase_id': this.purchase_id };
        this.curdService.getData('getPurchase', productId)
          .subscribe((data: any) => {

            if (data.status) {

              this.purchase = {
                'totalcost': data.data.totalcost,
                'image': data.data.image,
                'description': data.data.description,
                'purchase_date': data.data.purchase_date
              }
              if(data.data.image)
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
          let apiMethod = 'save_purchase';
          let merged;
          let updatePurchase;
          if (this.purchase_id > 0) {
            updatePurchase = { 'id': this.purchase_id };
          }else{
            updatePurchase = { 'id': 0};
          }
          merged = { ...updatePurchase, ...this.purchase };

          this.curdService.postData(apiMethod, merged)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.newstockdetail.reset();
                
                
              } else {
                this.appProvider.showToast(data.msg);
              }
              setTimeout(() => {
                
                this.appProvider.dismissLoading();
               if (data.status)
               this.appProvider.goto('mypurchases', 1);
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
    this.uploadImage.pickImage();
    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        console.log('isLoadingSubscriber '+data);
        this.isLoading = data;
      });
    }
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
        console.log('croppedImagepathSubscriber '+data);
        this.croppedImagepath = data;
        this.imageName = this.uploadImage.imageFileName();
        if (this.imageName) {
          this.purchase.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);
          if (typeof this.croppedImagepathSubscriber == 'object'){
            this.isLoading = false;
            this.croppedImagepathSubscriber.unsubscribe();
            this.isLoadingSubscriber.unsubscribe();
          }
        }

        console.log('this.imageName ' + this.imageName);
      });
    }
  }

  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();

    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();

    if (typeof this.routSub == 'object')
      this.routSub.unsubscribe();
     
        this.appProvider.dismissLoading();
      
  }

}
