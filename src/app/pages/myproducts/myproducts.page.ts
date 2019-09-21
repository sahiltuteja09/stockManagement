import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';

@Component({
  selector: 'app-myproducts',
  templateUrl: './myproducts.page.html',
  styleUrls: ['./myproducts.page.scss'],
})
export class MyproductsPage implements OnInit {

  page: number = 1;
  myproducts: any = [];
  totalSold:any= [];
  totalReturn:any= [];
  totalLoss:any= [];
  totalDamage:any= [];
  noDataFound: string = 'Fetching records...';
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  constructor(private appProvider: CoreAppProvider, private curdService: CurdService) { }

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.products();
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }
  products() {
    this.myproducts = [];
    this.totalSold = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('myProducts', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.myproducts = [];
            } else {
              this.myproducts = data;
              this.totalSold = data.total_sold;
              this.totalReturn = data.total_return;
              this.totalLoss = data.total_loss;
              this.totalDamage = data.total_damage;
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
  goto(page,product) {

    this.appProvider.searchParam(page, { queryParams: { term:  product.marketplace_unique_id} });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.products();
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'page': this.page };
      this.curdService.getData('myProducts', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.myproducts.data.push(result.data[i]);
              }
              Object.assign(this.totalSold, result.total_sold);
              Object.assign(this.totalReturn, result.total_return);
              Object.assign(this.totalLoss, result.total_loss);
              Object.assign(this.totalDamage, result.total_damage);
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


}
