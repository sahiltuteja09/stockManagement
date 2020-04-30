import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.page.html',
  styleUrls: ['./sale.page.scss'],
})
export class SalePage implements OnInit {
  startDate:string= new Date().toISOString();
  endDate: any = new Date().toISOString();
  startDate_date_format:string;
  endDate_date_format:string;

  stockType:number = 0;
  merchant:number = 0;
  noDataFound: string = "Please use filter to search the product reports.";
  reportData: any = [];

  stock: any;
  stockStatus: any = [];
  isStockStatusFetched: boolean = false;
  merchants: any = [];
  defaultImage:string = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  img_base: string = CoreConfigConstant.uploadedPath;
  page: number = 1;
  stockInSum:any = {};
  stockOutSum:any = {};
  constructor(
    private appProvider: CoreAppProvider,
     private curdService: CurdService, 
     private modalController: ModalController, 
     public authenticationService: AuthenticationService) { 
       
     const currentUser = this.authenticationService.currentUserValue;
         const imgUserID = currentUser.id;
         this.img_base = this.img_base + imgUserID + 'assets/';

     }

  ngOnInit() {
    this.getStockType();
    this.getMerchants();
    this.filterReport();
  }
  formatDate(){
    if (this.startDate) {
      var startdate = new Date(this.startDate);
      this.startDate_date_format = startdate.getFullYear() + '-' + (startdate.getMonth() < 10 ? '0' + ((startdate.getMonth()) * 1 + 1) : ((startdate.getMonth()) * 1 + 1)) + '-' + (startdate.getDate() < 10 ? '0' + startdate.getDate() : startdate.getDate());
    }else{
      this.appProvider.showToast('The start date field is required.');
      return false;
    }

    if (this.endDate) {
      var enddate = new Date(this.endDate);
      this.endDate_date_format = enddate.getFullYear() + '-' + (enddate.getMonth() < 10 ? '0' + ((enddate.getMonth()) * 1 + 1) : ((enddate.getMonth()) * 1 + 1)) + '-' + (enddate.getDate() < 10 ? '0' + enddate.getDate() : enddate.getDate());
    }else{
      this.appProvider.showToast('The end date field is required.');
      return false;
    }

    let parameter = { 'fromDate': this.startDate_date_format, 'toDate': this.endDate_date_format, 'stockType': this.stockType, 'merchant': this.merchant, 'page':this.page };
  return parameter;
  }
  filterReport() {
    this.page = 1;
    this.reportData = [];
    let parameter= this.formatDate();
  if(!parameter){
      return;
  }  
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.postData('filterReport', parameter)
          .subscribe((data: any) => {

            if (data.status == false) {
              this.appProvider.showToast(data.msg);
              this.noDataFound = data.msg;
            } else {
              console.log(data);
              this.reportData = data;
              this.stockInSum = data.stockin;
              this.stockOutSum = data.stock_out;
              this.page = this.page+1;
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
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param:any = this.formatDate();
      let apiMethod = 'filterReport';

      this.curdService.postData(apiMethod, param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.reportData.data.push(result.data[i]);
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

  getStockType() {
    this.curdService.getData('getProductStatus')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
            this.isStockStatusFetched = false;
          } else {
            this.isStockStatusFetched = true;
            this.stockStatus = data;
          }
        },
        error => {
          this.isStockStatusFetched = false;
        }
      );
  }
  getMerchants() {
    this.curdService.getData('getMerchants')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
            this.isStockStatusFetched = false;
          } else {
            this.isStockStatusFetched = true;
            this.merchants = data;
          }
        },
        error => {
          this.isStockStatusFetched = false;
        }
      );
  }
  getStockIn(pid:any){
   // console.log(this.stockInSum[pid]);
    if(this.stockInSum[pid] == undefined){
      return 0;
    }else{
      return this.stockInSum[pid][1];
    }
  }
  getStockOut(pid:any){
    // console.log(this.stockInSum[pid]);
     if(this.stockOutSum[pid] == undefined){
       return 0;
     }else{
       return this.stockOutSum[pid][2];
     }
   }
  goforProductReport(product_history) {
    this.appProvider.navTo('sale/product-report', product_history.product_id, { queryParams: { marketplace_id: this.merchant, product_status_id: this.stockType, start_date:this.startDate_date_format, end_date:this.endDate_date_format } });
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }
}
