import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-purchasesview',
  templateUrl: './purchasesview.page.html',
  styleUrls: ['./purchasesview.page.scss'],
})
export class PurchasesviewPage implements OnInit {
  isMobile:boolean = true;
  purchaseDetail:any = [];
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  constructor(private appProvider: CoreAppProvider,private modalController: ModalController,
    private callNumber: CallNumber,private socialSharing: SocialSharing) { 
    this.isMobile = this.appProvider.isMobile();
    this.purchaseDetail = this.appProvider.tempStorage;
    console.log(this.purchaseDetail);
  }

  ngOnInit() {
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

}
