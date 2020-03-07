import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigConstant } from 'src/configconstants';
import { ActionSheetController } from '@ionic/angular';
import { AuthenticationService } from '../auth/authentication.service';


interface Purchases {
  image: string;
  totalcost: number;
  description: string;
  purchase_date:string,
  name:string,
  mobile_number:string,
  amount_paid:number
}

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
})
export class PurchasesPage implements OnInit {
  purchase: Purchases = <Purchases>{};
  isLoading: boolean = false;
  //croppedImagepath: string = '';
  croppedImagepath: any[] = [];
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  public newstockdetail: FormGroup;

  isMobileDevice: boolean = true;

  routSub: any;
  purchase_id: number = 0;
  scanType:string = '';
  selectedAmazountPaid = 'full';
  partialChecked:boolean = false;
  partialAmount:any =0;
  img_base: string = CoreConfigConstant.uploadedPath;
  countImage: number = 0;
  constructor(
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController, 
    public authenticationService: AuthenticationService) { 
      
    const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';

    this.purchase = {
      'totalcost': 0,
      'image': '',
      'description': '',
      'purchase_date':new Date().toISOString(),
      'name':'',
      'mobile_number': '',
      'amount_paid': 0
    };
    this.newstockdetail = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      purchase_date: ['', Validators.compose([Validators.required])],
      totalcost: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      amount_paid: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      mobile_number: ['', Validators.compose([Validators.maxLength(13), Validators.required])],
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
  onChangeHandler(event: any){
    this.selectedAmazountPaid = event.detail.value;
    if(event.detail.value == 'full'){
      this.partialChecked = false;
      this.purchase.amount_paid = this.purchase.totalcost;
    }else{
      this.partialChecked = true;
      this.purchase.amount_paid = this.partialAmount;
    }
  }
  updatePaidAmount(event: any){
    if(this.selectedAmazountPaid == 'full'){
      this.purchase.amount_paid = event.target.value;
    }
  }
  ngOnInit() {
    if (this.purchase_id > 0) {
      this.getDetail();
      this.getKhataImages();
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
                'purchase_date': data.data.purchase_date,
                'name': data.data.name,
                'mobile_number' : data.data.mobile_number,
                'amount_paid':data.data.amount_paid
              }
this.partialChecked = true; 
this.partialAmount = data.data.amount_paid;
             // setTimeout(() => {
              //   this.purchase.amount_paid = data.data.amount_paid;
              // }, 1000);
             // if(data.data.image)
               // this.croppedImagepath = this.img_base + data.data.image;

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
  getKhataImages(){
    // this.appProvider.showLoading().then(loading => {
    //   loading.present().then(() => {
        let param = { 'purchase_id':this.purchase_id};
        this.curdService.getData('getPurchaseImages', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.croppedImagepath = [];
            } else {
              this.croppedImagepath = [];
              for(let i=0;i < data.data.length; i++){
                this.countImage  = i;
                this.croppedImagepath[this.countImage ] = data.data[i].image;
              }
            }
            //this.appProvider.dismissLoading();
          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            }
          );
    //   });
    // });
  }
  removeImg(item, e) {
    e.preventDefault();
    console.log(item);
    console.log(this.croppedImagepath);
    var index = this.croppedImagepath.indexOf(item);
    if (index !== -1) this.croppedImagepath.splice(index, 1);
    console.log(this.croppedImagepath);
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

          if(Object.keys(this.croppedImagepath).length > 0){
            this.purchase.image =  this.croppedImagepath[0];
          }

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

                this.saveKhataImage(data.khata_id);
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
  saveKhataImage(id) {
    if(Object.keys(this.croppedImagepath).length == 0){
      return false;
    }
    let param = { 'id': id };
    let images = { 'images': this.croppedImagepath };

    let merged = { ...param, ...images };
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let apiMethod = 'saveKhataImage';
        this.curdService.postData(apiMethod, merged)
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.data);

            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {

              this.appProvider.dismissLoading();
              // if (data.status)
              //   this.appProvider.goto('mypurchases', 1);
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
  

  async pickImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          console.log('Delete clicked');
          this.imageSelector('camera');
        }
      }, {
        text: 'Photo albums',
        icon: 'images',
        handler: () => {
          this.imageSelector();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  imageSelector(type?:string) {
    if(type== 'camera')
    this.uploadImage.captureImage();
    else
  this.uploadImage.pickImage();
    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        console.log('isLoadingSubscriber '+data);
        this.isLoading = data;
      });
    }
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
      //  console.log('croppedImagepathSubscriber '+data);
        //this.croppedImagepath = data;
        let imageName = this.uploadImage.imageFileName();

        if (imageName) {
          if (typeof this.croppedImagepathSubscriber == 'object') {
            this.isLoading = false;
            this.croppedImagepathSubscriber.unsubscribe();
            this.isLoadingSubscriber.unsubscribe();
            this.croppedImagepathSubscriber = '';
            setTimeout(() => {
              this.croppedImagepath[this.countImage] = imageName;
              this.countImage = this.countImage + 1;
            }, 2000);
          }
        }

        // if (this.imageName) {
        //   this.purchase.image = this.imageName;
        //   console.log('this.imageName if ' + this.imageName);
        //   if (typeof this.croppedImagepathSubscriber == 'object'){
        //     this.isLoading = false;
        //     this.croppedImagepathSubscriber.unsubscribe();
        //     this.isLoadingSubscriber.unsubscribe();
        //   }
        // }

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
