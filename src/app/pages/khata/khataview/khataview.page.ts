import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {CoreConfigConstant} from '../../../../configconstants';
import { CurdService } from 'src/app/services/rest/curd.service';
@Component({
  selector: 'app-khataview',
  templateUrl: './khataview.page.html',
  styleUrls: ['./khataview.page.scss'],
})
export class KhataviewPage implements OnInit {
  khataDetail:any = [];
  backButtonSub:any;
  isMobile:boolean = true;
  noDataFound:string = '';
  constructor(
    public appProvider: CoreAppProvider, 
    public platform:Platform, 
    private socialSharing: SocialSharing,
    private curdService: CurdService
    ) { }

  ngOnInit() {
    console.log(JSON.stringify(this.appProvider.tempStorage));
   this.isMobile = this.appProvider.isMobile();
    this.khataDetail = this.appProvider.tempStorage;

  this.backButtonSub =  this.platform.backButton.subscribe(async () => {
      this.appProvider.searchParam('khata',{ queryParams: { mobile:  this.khataDetail.mobile_number} });
    });
  }
  BackButtonAction(){
    this.appProvider.searchParam('khata',{ queryParams: { mobile:  this.khataDetail.mobile_number} });
  }
  iionViewWillLeave() {
    this.backButtonSub.unsubscribe();
}
shareViaWhatsAppToReceiver(){
  let txt = '';
  if(this.khataDetail.you_got > 0){
    txt = 'You paid rs. '+this.khataDetail.you_got +' on '+this.khataDetail.on_date;
  }
  if(this.khataDetail.you_paid > 0){
    txt = 'You received rs. '+this.khataDetail.you_got +' on '+this.khataDetail.on_date;
  }
  this.socialSharing.shareViaWhatsAppToReceiver(this.khataDetail.mobile_number, txt);
}
shareSocial(){
  let txt = '';
  if(this.khataDetail.you_got > 0){
    txt = 'You paid rs. '+this.khataDetail.you_got +' on '+this.khataDetail.on_date;
  }
  if(this.khataDetail.you_paid > 0){
    txt = 'You received rs. '+this.khataDetail.you_got +' on '+this.khataDetail.on_date;
  }
  this.socialSharing.share(txt, 'Your Transaction with '+CoreConfigConstant.appName);
}
deleteTransaction(){
  console.log('deleteTransaction');
  let param:any = { 'khata_id': this.khataDetail.id};
  this.curdService.getData('deleteKhataRow', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              this.appProvider.showToast(result.msg);
              setTimeout(() => {
                this.appProvider.searchParam('khata', { queryParams: { mobile:  this.khataDetail.mobile_number} });
              }, 2000);
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
}

}
