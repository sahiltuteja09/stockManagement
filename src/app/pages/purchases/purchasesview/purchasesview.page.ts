import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';
import { CurdService } from 'src/app/services/rest/curd.service';
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
  constructor(private appProvider: CoreAppProvider,private modalController: ModalController,
    private callNumber: CallNumber,private socialSharing: SocialSharing, private route: ActivatedRoute, private curdService: CurdService) { 
    this.isMobile = this.appProvider.isMobile();

    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['purchase_id'];
    });
    if(this.searchTerm){
      this.getPurchaseDetail();
    }else{
      this.purchaseDetail = this.appProvider.tempStorage;
    }
  }

  ngOnInit() {
  }
  ionViewWillLeave() {
    this.queryParmSub.unsubscribe();
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
    let txt = 'Hi '+this.purchaseDetail.name+' I have bought item\'s Rs. '+this.purchaseDetail.totalcost +' on '+this.purchaseDetail.purchase_date+' and Amount paid Rs. '+this.purchaseDetail.amount_paid + '. Balance amount Rs. ' + (this.purchaseDetail.totalcost*1 - this.purchaseDetail.amount_paid*1);
    
    this.socialSharing.shareViaWhatsAppToReceiver(this.purchaseDetail.mobile_number, txt);
  }
  shareSocial(){
    let txt = 'Hi '+this.purchaseDetail.name+' I have bought item\'s Rs. '+this.purchaseDetail.totalcost +' on '+this.purchaseDetail.purchase_date+' and Amount paid Rs. '+this.purchaseDetail.amount_paid + '. Balance amount Rs. ' + (this.purchaseDetail.totalcost*1 - this.purchaseDetail.amount_paid*1);
    
    this.socialSharing.share(txt, 'Your Transaction with '+CoreConfigConstant.appName);
  }
  call(){
    if( this.appProvider.isMobile() ){
      this.callNumber.callNumber(this.purchaseDetail.mobile_number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
      }
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
