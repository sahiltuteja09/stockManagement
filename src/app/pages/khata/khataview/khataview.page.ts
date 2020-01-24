import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {CoreConfigConstant} from '../../../../configconstants';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ActivatedRoute } from '@angular/router';
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

  queryParmSub: any;
  khata_id:number = 0;
  constructor(
    public appProvider: CoreAppProvider, 
    public platform:Platform, 
    private socialSharing: SocialSharing,
    private curdService: CurdService,
    private route: ActivatedRoute
    ) {
      this.queryParmSub = this.route.queryParams.subscribe(params => {
        this.khata_id = params['khata_id'];
      });
     }

  ngOnInit() {
    console.log(JSON.stringify(this.appProvider.tempStorage));
   this.isMobile = this.appProvider.isMobile();
    this.khataDetail = this.appProvider.tempStorage;

  this.backButtonSub =  this.platform.backButton.subscribe(async () => {
      this.appProvider.searchParam('khata',{ queryParams: { mobile:  this.khataDetail.mobile_number} });
    });

    if(typeof this.khataDetail == 'undefined')
      this.khataDetails();
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
        let param = { 'id':this.khata_id };
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
viewBill(data:any){
  this.appProvider.tempData(data);
  this.appProvider.searchParam('purchasesview', { queryParams: { purchase_id:  this.khataDetail.purchase_id} });
}

BackButtonAction(){
  this.appProvider.searchParam('khata',{ queryParams: { mobile:  this.khataDetail.mobile_number} });
}
ionViewWillLeave() {
  this.backButtonSub.unsubscribe();
  this.queryParmSub.unsubscribe();
}
}
