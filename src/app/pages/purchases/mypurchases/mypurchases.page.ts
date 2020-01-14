import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
@Component({
  selector: 'app-mypurchases',
  templateUrl: './mypurchases.page.html',
  styleUrls: ['./mypurchases.page.scss'],
})
export class MypurchasesPage implements OnInit {
//https://ionicacademy.com/ionic-4-image-gallery-zoom/
  page: number = 1;
  mypurchases: any = [];
  lifeTimePurchase:any;
  noDataFound: string = 'Fetching records...';
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  isFiltered = false;

  startDate:string;
  endDate: any;
  startDate_date_format:string = '';
  endDate_date_format:string = '';
  keyword:string = '';
  constructor(
    private appProvider: CoreAppProvider, 
    private curdService: CurdService,
    private modalController: ModalController,
    private callNumber: CallNumber
    ) { }

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

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.purchases();
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }

  purchases() {
    this.isFiltered = false;
    this.mypurchases = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('myPurchases', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.mypurchases = [];
            } else {
              this.mypurchases = data;
              this.lifeTimePurchase = data.totalcost;
              this.page = this.page + 1;
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
  clearFileter(){
    this.isFiltered = false;
    this.startDate= '';
    this.endDate= '';
    this.keyword= '';
    this.purchases();
  }
  filterReport() {
    this.mypurchases = [];
    this.isFiltered = true;
    this.page = 1;
    let parameter = this.formatData();
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.getData('filterBillReport', parameter)
          .subscribe((data: any) => {

            if (data.status == false) {
              this.appProvider.showToast(data.msg);
              this.noDataFound = data.msg;
            } else {
              this.mypurchases = data;
              this.lifeTimePurchase = data.totalcost;
              this.page = this.page + 1;
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
  formatData(){
    if (this.startDate) {
      var startdate = new Date(this.startDate);
      this.startDate_date_format = startdate.getFullYear() + '-' + (startdate.getMonth() < 10 ? '0' + ((startdate.getMonth()) * 1 + 1) : ((startdate.getMonth()) * 1 + 1)) + '-' + (startdate.getDate() < 10 ? '0' + startdate.getDate() : startdate.getDate());
    }else{
     // this.appProvider.showToast('The start date field is required.');
    //  return false;
    }

    if (this.endDate) {
      var enddate = new Date(this.endDate);
      this.endDate_date_format = enddate.getFullYear() + '-' + (enddate.getMonth() < 10 ? '0' + ((enddate.getMonth()) * 1 + 1) : ((enddate.getMonth()) * 1 + 1)) + '-' + (enddate.getDate() < 10 ? '0' + enddate.getDate() : enddate.getDate());
    }else{
     // this.appProvider.showToast('The end date field is required.');
   //   return false;
    }

    let parameter = { 'fromDate': this.startDate_date_format, 'toDate': this.endDate_date_format, 'keyword': this.keyword, 'page':this.page };
    return parameter;
  }
  goto(page,product) {

    this.appProvider.searchParam(page, { queryParams: { term:  product.marketplace_unique_id} });
  }

  doRefresh(event) {
    setTimeout(() => {
      if(this.isFiltered){
        this.filterReport();
      }else{
        this.purchases();
      }
      
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param:any = { 'page': this.page };
      let apiMethod = 'myPurchases';

      if(this.isFiltered){
        apiMethod = 'filterBillReport';
        param = this.formatData();
      }
      this.curdService.getData(apiMethod, param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.mypurchases.data.push(result.data[i]);
              }
              this.page = this.page + 1;
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
      infiniteScroll.target.complete();
    }, 2000);
  }

  callToVendor(number:any){
   if( this.appProvider.isMobile() ){
    this.callNumber.callNumber(number, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
    }
  }
  purchaseview(data:any){
    this.appProvider.navigateWithState('purchasesview', data);
  }

}
