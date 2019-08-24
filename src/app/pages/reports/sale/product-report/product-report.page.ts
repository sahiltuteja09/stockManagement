import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.page.html',
  styleUrls: ['./product-report.page.scss'],
})
export class ProductReportPage implements OnInit {
  routSub: any;
  queryParmSub: any;

  product_reports: any = [];
  product_name_header :any = [];

  // query parameters
  product_id: number;
  marketplace_id: number = 0;
  product_status_id: number = 0;
  start_date:string = '';
  end_date:string = '';

  // from ngModel
  stockType:number = 0;
  merchant:number = 0;
  startDate: string;
  endDate: string;

  page: number = 1;
  noDataFound: string = '';

  // for drop down filter
  stockStatus: any = [];
  merchants: any = [];
 showReason = '';

  // for name maping dynamically
stockmap: any = [];
merchantmap:any = [];
  constructor(private route: ActivatedRoute,
    private appProvider: CoreAppProvider,
    private curdService: CurdService
  ) { }
  // Prevent memory leaks
  ngOnDestroy() {
    this.routSub.unsubscribe();
    this.queryParmSub.unsubscribe();
  }
  ngOnInit() {
    this.getStockType();
    this.getMerchants();

    this.routSub = this.route.params.subscribe((params) => {
      this.product_id = params['product_id'];

    });

    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.marketplace_id = params['marketplace_id'] ? params['marketplace_id'] : 0;
      this.product_status_id = params['product_status_id'] ? params['product_status_id'] : 0;
      this.start_date = params['start_date'] ? params['start_date'] : 0;
      this.end_date = params['end_date'] ? params['end_date'] : 0;

      this.startDate = this.start_date;
      this.endDate = this.end_date;
      this.merchant = this.marketplace_id;
      this.stockType = this.product_status_id;
    });
    
    this.productReport();
  }

  productReport() {
    this.product_reports = [];

    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'product_id': this.product_id, 'marketplace_id': this.marketplace_id, 'product_status_id': this.product_status_id, page: this.page, 'fromDate': this.start_date, 'toDate': this.end_date };
        this.curdService.postData('productReport', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.product_reports = [];
            } else {
              this.product_reports = data;
              this.product_name_header = data;
              this.page = this.page+1;
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

  productReportFilter() {
    this.product_reports = [];

    // reset query filter before to apply filter here
    this.start_date = '';
    this.end_date = '';
    this.marketplace_id= 0;
    this.product_status_id = 0;


    if (this.startDate) {
      var startdate = new Date(this.startDate);
      this.start_date = startdate.getFullYear() + '-' + (startdate.getMonth() < 10 ? '0' + ((startdate.getMonth()) * 1 + 1) : ((startdate.getMonth()) * 1 + 1)) + '-' + (startdate.getDate() < 10 ? '0' + startdate.getDate() : startdate.getDate());
    }
    if (this.endDate) {
      var enddate = new Date(this.endDate);
      this.end_date = enddate.getFullYear() + '-' + (enddate.getMonth() < 10 ? '0' + ((enddate.getMonth()) * 1 + 1) : ((enddate.getMonth()) * 1 + 1)) + '-' + (enddate.getDate() < 10 ? '0' + enddate.getDate() : enddate.getDate());
    }
    if(this.merchant){
      this.marketplace_id = +this.merchant;
    }
    if(this.stockType){
      this.product_status_id = +this.stockType;
    }

    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'product_id': this.product_id, 'marketplace_id': this.marketplace_id, 'product_status_id': this.product_status_id, page: this.page, 'fromDate': this.start_date, 'toDate': this.end_date };
        this.curdService.postData('productReport', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.product_reports = [];
            } else {
              this.product_reports = data;
              this.page = this.page+1;
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
  getStockType() {
    this.curdService.getData('getProductStatus')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
          } else {
            this.stockStatus = data;
            let stockData = data.data;
            for (let stock of stockData) {
              this.stockmap[stock.id] = stock.type;
            }
          }
        },
        error => {
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
          } else {
            this.merchants = data;
            let marketPlace = data.data;
            for (let m of marketPlace) {
              this.merchantmap[m.id] = m.name;
            }
          }
        },
        error => {
        }
      );
  }

  stockName(id) {
    let data = this.stockStatus;
    if(data.status){
      return this.stockmap[id]
    }else{
      return id;
    }
  }

  merchantName(id) {
    let data = this.merchants;
    if(data.status){
      return this.merchantmap[id]
    }else{
      return id;
    }
  }

  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'product_id': this.product_id, 'marketplace_id': this.marketplace_id, 'product_status_id': this.product_status_id, page: this.page, 'fromDate': this.start_date, 'toDate': this.end_date };
      this.curdService.postData('productReport', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.product_reports.data.push(result.data[i]);
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

  showHide(pid){
    if(this.showReason != '') 
    this.showReason = '';
    else
    this.showReason = pid;

  }

}
