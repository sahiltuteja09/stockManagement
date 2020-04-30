import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';
import { CurdService } from 'src/app/services/rest/curd.service';
import { AuthenticationService } from '../../auth/authentication.service';
@Component({
  selector: 'app-purchasesview',
  templateUrl: './purchasesview.page.html',
  styleUrls: ['./purchasesview.page.scss'],
})
export class PurchasesviewPage implements OnInit {
  isMobile:boolean = true;
  //purchaseDetail:any = [];
  purchaseDetail = {
    'id': '',
    'name':'',
    'purchase_date':'',
    'totalcost':0,
    'amount_paid':0,
    'description':'',
    'mobile_number':'',
    'image':''
  }
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  queryParmSub:any;
  searchTerm:string;
  khataImges:any = [];
  constructor(
    private appProvider: CoreAppProvider,
    private modalController: ModalController,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing, 
    private route: ActivatedRoute,
     private curdService: CurdService, 
     public authenticationService: AuthenticationService) { 
       
     const currentUser = this.authenticationService.currentUserValue;
         const imgUserID = currentUser.id;
         this.img_base = this.img_base + imgUserID + 'assets/';

    this.isMobile = this.appProvider.isMobile();

    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['purchase_id'];
    });
   
  }
  ionViewWillEnter(){
    if(this.searchTerm){
      this.getPurchaseDetail();
      this.purchaseDetail.id = this.searchTerm;
    }else{
      if(this.appProvider.tempStorageData == null || this.appProvider.tempStorageData == undefined){
        this.appProvider.goto('mypurchases',1);
      }else{
        this.purchaseDetail = this.appProvider.tempStorageData;
      }
      
    }
  }

  ngOnInit() {
    this.getKhataImages();
  }
  ionViewWillLeave() {
    this.queryParmSub.unsubscribe();
    //this.appProvider.deleteStorage();
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
  shareViaWhatsAppToReceiver(){// https://www.freakyjolly.com/ionic-3-share-and-save-images-from-applications-assets-folder-to-device/
    let txt = 'Hi '+this.purchaseDetail.name+' I have bought the item\'s of Rs. '+this.purchaseDetail.totalcost +'/- on '+this.purchaseDetail.purchase_date+' and Amount paid is Rs. '+this.purchaseDetail.amount_paid + '/-. Balance amount is Rs. ' + (this.purchaseDetail.totalcost*1 - this.purchaseDetail.amount_paid*1)+'/-';
    
    this.socialSharing.shareViaWhatsAppToReceiver("91"+this.purchaseDetail.mobile_number, txt);
  }
  shareSocial(){
    let txt = 'Hi '+this.purchaseDetail.name+' I have the bought item\'s of Rs. '+this.purchaseDetail.totalcost +'/- on '+this.purchaseDetail.purchase_date+' and Amount paid is Rs. '+this.purchaseDetail.amount_paid + '/-. Balance amount is Rs. ' + (this.purchaseDetail.totalcost*1 - this.purchaseDetail.amount_paid*1)+'/-';
    
    this.socialSharing.share(txt, 'Your Transaction with '+CoreConfigConstant.appName);
  }
  call(){
    if( this.appProvider.isMobile() ){
      this.callNumber.callNumber(this.purchaseDetail.mobile_number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
      }
  }
  editPurchase(){
    
    this.appProvider.goto('mypurchases/purchases/'+this.purchaseDetail.id);
  }
  getPurchaseDetail(){


    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let productId = { 'purchase_id': this.searchTerm };
        this.curdService.getData('getPurchase', productId)
          .subscribe((data: any) => {

            if (data.status) {
               this.purchaseDetail = data.data;

            } else {
              this.appProvider.showToast(data.msg);
            }
            this.appProvider.dismissLoading();

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
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'purchase_id':this.purchaseDetail.id};
        this.curdService.getData('getPurchaseImages', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.khataImges = data;
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

}
