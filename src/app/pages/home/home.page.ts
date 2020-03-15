import { Component } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';
import { interval } from 'rxjs';
import { CoreConfigConstant } from 'src/configconstants';
import { LocalnotificationService } from 'src/app/services/notification/localnotification.service';
import { OnesignalnotificationService } from 'src/app/services/notification/onesignalnotification.service';
import { ScrollHideConfig } from 'src/app/providers/hide-heaer-footer/hide-header.directive';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  latestStock: any = [];
  page: number = 1;
  noDataFound: string = 'Fetching records...';
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  userID: number = 0;

  secondsCounter = interval(120000);
  counter: any = '';
  unreadMsgSub: any;

  footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
 // notifications: any[] = [];
  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
    private router: Router,
    private route: ActivatedRoute,
    public events: Events,
    private authenticationService: AuthenticationService,
    private localNotification: LocalnotificationService,
    private oneSignalService: OnesignalnotificationService
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    this.userID = currentUser.id;
    this.img_base = this.img_base + this.userID + 'assets/';
    this.checkNetworkStatus();
    this.checkUpdates();
    this.unreadMsgSub = this.secondsCounter.subscribe(x => { // will execute every 30 seconds
      this.checkUpdates();
    });
    localNotification.stockReminder();
    localNotification.stockQuantityNotification();
  }

  

  ngOnInit() {
    this.oneSignalService.initOneSignalPush();
   // this.stockLatest();
  }
  ionViewWillEnter() {
    this.stockLatest();
  }
  checkUpdates() {
    this.curdService.getData('unreadMsg')
      .subscribe((data: any) => {
        if (data.status) {
          this.counter = +(data.data);
        }
      }
      );
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
    this.appProvider.navTo('request-quote', data.id, data.user_id)
  }

  checkNetworkStatus() {
    this.appProvider.initializeNetworkEvents();

    this.events.subscribe('network:offline', () => {
      if (this.router.url != '/no-internet') {
        let routePage = this.router.routerState.snapshot.url;
        console.log('snapshot.redirectUrl => ' + routePage);
        if (routePage) {
          this.router.navigate(['/no-internet'], { queryParams: { returnUrl: routePage }, replaceUrl: true });
        } else {
          this.router.navigate(['/no-internet'], { replaceUrl: true });
        }
      }

    });
    this.events.subscribe('network:online', () => {
      if (this.router.url == '/no-internet') {
        // get param
        let redirectUrl = this.route.snapshot.queryParams["returnUrl"];
        console.log('redirectUrl ' + redirectUrl);
        if (redirectUrl) {
          this.router.navigate([redirectUrl]);
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }
  goto(page,product) {

    this.appProvider.searchParam(page, { queryParams: { term:  product.title} });
  }
  ionViewWillLeave() {
    this.unreadMsgSub.unsubscribe();
    this.appProvider.dismissLoading();
  }
}
