import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { Platform, ModalController, AlertController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {CoreConfigConstant} from '../../../../configconstants';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../auth/authentication.service';
import { ImageModalPage } from '../../image-modal/image-modal.page';
@Component({
  selector: 'app-khataview',
  templateUrl: './khataview.page.html',
  styleUrls: ['./khataview.page.scss'],
})
export class KhataviewPage implements OnInit {
  backButtonSub:any;
  isMobile:boolean = true;
  noDataFound:string = '';

  khataImges:any = [];
  img_base: string = CoreConfigConstant.uploadedPath;

  khataDetail:any = {
    'you_got' : 0,
    'name' : '',
    'you_paid':0,
    'description': '',
    'purchase_id':0,
    'mobile_number':'',
  }
  constructor(
    public appProvider: CoreAppProvider, 
    public platform:Platform, 
    private socialSharing: SocialSharing,
    private curdService: CurdService,
    private route: ActivatedRoute, private modalController: ModalController,
    public authenticationService: AuthenticationService,public alertController: AlertController
    ) { 
      const currentUser = this.authenticationService.currentUserValue;
      const imgUserID = currentUser.id;
      this.img_base = this.img_base + imgUserID + 'assets/';
      
      
 }
 ionViewWillEnter() {
  let kDetail = this.appProvider.tempStorage;

  if( kDetail == undefined || kDetail == null){
    this.appProvider.searchParam('mykhatas', { skipLocationChange: true });
  }else{
    this.khataDetail = [];
    this.khataDetail = kDetail;
    this.getKhataImages();
  }
 }

  ngOnInit() {
   this.isMobile = this.appProvider.isMobile();
    
  this.backButtonSub =  this.platform.backButton.subscribe(async () => {
      this.appProvider.searchParam('khata',{ queryParams: { mobile:  this.khataDetail.mobile_number, 'name': this.khataDetail.name, 'img':this.khataDetail.img}, replaceUrl: true });
    });
  
  }
  khataDetails(){
    this.khataDetail = {
      'you_got' : 0,
      'name' : '',
      'you_paid':0,
      'description': '',
      'purchase_id':0,
      'mobile_number':'',
    }
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'id': this.khataDetail.id };
        this.curdService.getData('myKhataDetail', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
            } else {
              this.khataDetail = [];
              this.khataDetail = data.data;
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
  }
editKhatas(){
  // let type = this.khataDetail.you_got  > 0 ? '2' : '1';
  // let amount =  this.khataDetail.you_got  > 0 ? this.khataDetail.you_got : this.khataDetail.you_paid;
  // this.appProvider.tempData({'name':this.khataDetail.name,'id':this.khataDetail.id, 'type':type, 'mobile': this.khataDetail.mobile_number, 'amount': amount,'description': this.khataDetail.description,purchase_date:new Date().toISOString()});
  //   this.appProvider.searchParam('addkhata');
}
openPreview(img) {
  this.modalController.create({
    component: ImageModalPage,
    componentProps: {
      img: img
    }
  }).then(modal => {
    modal.present();
  });
}
shareViaWhatsAppToReceiver(){
  let txt = '';
  if(this.khataDetail.you_got > 0){
    txt = 'Hi '+this.khataDetail.name+' I have paid rs. '+this.khataDetail.you_got +'/- on '+this.khataDetail.on_date;
  }
  if(this.khataDetail.you_paid > 0){
    txt = 'Hi '+this.khataDetail.name+ ' I received rs. '+this.khataDetail.you_got +'/- on '+this.khataDetail.on_date + '. Thank you.';
  }
  if(this.khataDetail.you_got > 0 && this.khataDetail.you_paid > 0){
     txt = 'Hi '+this.khataDetail.name+' I have bought the item\'s of Rs. '+this.khataDetail.you_got +'/- on '+this.khataDetail.on_date+' and Amount paid is Rs. '+this.khataDetail.you_paid + '/-. Balance amount is Rs. ' + (this.khataDetail.you_got*1 - this.khataDetail.you_paid*1)+'/-';
  }
  console.log(txt);
  this.socialSharing.shareViaWhatsAppToReceiver("91"+this.khataDetail.mobile_number, txt);
}
shareSocial(){
  let txt = '';
  if(this.khataDetail.you_got > 0){
    txt = 'Hi '+this.khataDetail.name+' I have paid rs. '+this.khataDetail.you_got +'/- on '+this.khataDetail.on_date;
  }
  if(this.khataDetail.you_paid > 0){
    txt = 'Hi '+this.khataDetail.name+ ' I received rs. '+this.khataDetail.you_got +'/- on '+this.khataDetail.on_date + '. Thank you.';
  }
  if(this.khataDetail.you_got > 0 && this.khataDetail.you_paid > 0){
     txt = 'Hi '+this.khataDetail.name+' I have bought the item\'s of Rs. '+this.khataDetail.you_got +'/- on '+this.khataDetail.on_date+' and Amount paid is Rs. '+this.khataDetail.you_paid + '/-. Balance amount is Rs. ' + (this.khataDetail.you_got*1 - this.khataDetail.you_paid*1)+'/-';
  }
  this.socialSharing.share(txt, 'Your Transaction with '+CoreConfigConstant.appName);
}
getKhataImages(){
  this.appProvider.showLoading().then(loading => {
    loading.present().then(() => {
      let param = { 'khata_id': this.khataDetail.id};
      this.curdService.getData('getKhataImages', param)
        .subscribe((data: any) => {
          if (data.status == false) {
            // no product found
            this.khataImges = data;
            this.noDataFound = '';
          } else {
            this.khataImges = [];
            this.khataImges = data;
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
}

async deleteTransaction(){
  console.log('deleteTransaction');

  const alert = await this.alertController.create({
    header: 'Confirm!',
    message: 'Are you sure?',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.appProvider.showLoading().then(loading => {
            loading.present().then(() => {

          let param:any = { 'khata_id': this.khataDetail.id};
      this.curdService.getData('deleteKhataRow', param)
        .subscribe(
          (result: any) => {
            this.appProvider.dismissLoading();
            if (result.status == false) {
              // no product found
              this.appProvider.showToast(result.msg);
            } else {
              this.appProvider.showToast(result.msg);
              setTimeout(() => {
                this.appProvider.searchParam('khata', { queryParams: { mobile:  this.khataDetail.mobile_number}, skipLocationChange: true });
              }, 2000);
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
        })
      });

        }
      }
    ]
  });

  await alert.present();
}
viewBill(data:any){
  this.appProvider.tempData(data);
  this.appProvider.searchParam('purchasesview', { queryParams: { purchase_id:  this.khataDetail.purchase_id} });
}

BackButtonAction(){
  this.appProvider.searchParam('khata',{ queryParams: { mobile:  this.khataDetail.mobile_number, 'name': this.khataDetail.name, 'img':this.khataDetail.img}, replaceUrl: true});
}
ionViewWillLeave() {
  this.backButtonSub.unsubscribe();
  this.appProvider.deleteStorage();
}
}
