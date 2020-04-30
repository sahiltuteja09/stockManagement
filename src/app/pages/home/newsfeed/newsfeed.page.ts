import { Component } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.page.html',
  styleUrls: ['./newsfeed.page.scss'],
})
export class NewsfeedPage {
  latestStock: any = [];
  page: number = 1;
  noDataFound: string = 'Fetching records...';
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  imgBase:string = '';
  userID: number = 0;

 // notifications: any[] = [];
  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
    private authenticationService: AuthenticationService
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    this.userID = currentUser.id;
    this.imgBase = this.img_base;
    this.img_base = this.img_base + this.userID + 'assets/';
  }

  
  ionViewWillEnter() {
    this.stockLatest();
  }


  // https://medium.com/google-developer-experts/angular-supercharge-your-router-transitions-using-new-animation-features-v4-3-3eb341ede6c8

  stockLatest() {
    this.appProvider.dismissLoading();
    
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('home', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.latestStock = [];
            } else {
              this.latestStock = [];
              this.latestStock = data;
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
  userLikes(pid: any) {
    let param = { 'pid': pid.id };
    this.curdService.getData('updateLikes', param)
      .subscribe((data: any) => {
        if (data.status == false) {
          // no product found
          this.appProvider.showToast(data.msg);
        } else {
          pid.likes = data.data;
        }
        this.appProvider.dismissLoading();
      },
        error => {
          this.appProvider.showToast(error);
          this.appProvider.dismissLoading();
        }
      );
  }


  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'page': this.page };
      this.curdService.getData('home', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.latestStock.data.push(result.data[i]);
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
  doRefresh(event) {
    setTimeout(() => {
      this.stockLatest();
      event.target.complete();
    }, 2000);
  }
  requestQuote(data) {
    this.appProvider.navTo('myquotes/request-quote', data.id, data.user_id)
  }

  goto(page,product) {

    this.appProvider.searchParam(page, { queryParams: { term:  product.title} });
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }
}

