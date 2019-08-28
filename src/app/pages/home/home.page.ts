import { Component } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Events } from '@ionic/angular';
import { interval } from 'rxjs';
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { CoreConfigConstant } from 'src/configconstants';
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

  secondsCounter = interval(30000);
  counter: any = '';
  unreadMsgSub: any;
 // notifications: any[] = [];
  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
    private router: Router,
    private route: ActivatedRoute,
    public events: Events,
    private authenticationService: AuthenticationService,
    private localNotifications: LocalNotifications
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    this.userID = currentUser.id;
    this.checkNetworkStatus();
    this.checkUpdates();
    this.unreadMsgSub = this.secondsCounter.subscribe(x => { // will execute every 30 seconds
      this.checkUpdates();
    });
    console.log('appProvider.isMobile()');
    console.log(appProvider.isMobile());
    if (appProvider.isMobile()) {
    console.log('is Mobile');
// check local notification permission
    this.localNotifications.hasPermission().then((hasPermission) => {
      console.log('hasPermission '+hasPermission);
      if(hasPermission){
          this.isLocalNotificationIsScheduled();
      }else{
        console.log('requestPermission ');
        this.localNotifications.requestPermission().then((granted)=>{
          console.log('requestPermission '+granted);
          if(granted){
            this.isLocalNotificationIsScheduled();
          }
        });
      }

    });
  }
  }
  
// check if already scheduled local notifications
  isLocalNotificationIsScheduled(){
    this.localNotifications.getScheduledIds().then((ids) => {
      let isScheduled =  Array.isArray(ids);
      console.log('isScheduled '+isScheduled);
      console.log(ids);
      console.log(ids.length);
     // if(ids.length == 0){
        this.setReminders();
     // }
      }).catch((err) => { console.log('isLocalNotificationIsScheduled ');  console.log( err); });
  }
// set local notification for week and 3 time is a day
  setReminders() {
console.log('setReminders');
    // let cDate = new Date();
    // //for (let dayDifference = 1; dayDifference <= 7; dayDifference++) {

    //   cDate.setDate(cDate.getHours() + (24 * (dayDifference)));
    //   cDate.setHours(12);
    //   cDate.setMinutes(10);

      let notifications = 
      [
        {
        id: 1,
        title: 'Today Stock',
        text: 'A reminder to update the today stock.',
        trigger: {every: { hour: 12, minute: 10 }},
        foreground: true
      },
      {
        id: 2,
        title: 'Stock Update Reminder',
        text: 'Hey! Any updates on stock?',
        trigger: {every: { hour: 18, minute: 10 }},
        foreground: true
      },
      {
        id: 3,
        title: 'Stock verify',
        text: 'Hey! Have you check today reports ?',
        trigger: {every: { hour: 18, minute: 10 }},
        foreground: true
      },
      {
        id: 4,
        title: 'Test',
        text: 'Hey! Have you check today reports ?',
        trigger: {every: { hour: 18, minute: 11, second: 10 }},
        foreground: true,
        actions: [
          { id: 'yes', title: 'Yes' },
          { id: 'no', title: 'No' }
          ]
      }
    ];
//       this.notifications.push(notification);

//       cDate.setDate(cDate.getHours() + (24 * (dayDifference)));
//       cDate.setHours(18);
//       cDate.setMinutes(10);

//       let notification1 = {
//         id: dayDifference + ""+dayDifference,
//         title: 'Stock Update Reminder',
//         text: 'Hey! Any updates on stock?',
//         trigger: {at: cDate, every: 'week'}
//       };

//       this.notifications.push(notification1);


//       cDate.setDate(cDate.getHours() + (24 * (dayDifference)));
//       cDate.setHours(21);
//       cDate.setMinutes(10);

//       let notification2 = {
//         id: dayDifference+ ""+dayDifference+ ""+dayDifference,
//         title: 'Stock verify',
//         text: 'Hey! Have you check today reports ?',
//         trigger: {at: cDate, every: 'week'}
//       };

//       this.notifications.push(notification2);


//       cDate.setDate(cDate.getHours() + (24 * (dayDifference)));
//       cDate.setHours(17);
//       cDate.setMinutes(15);
// console.log(cDate);
//       let notificationt = {
//         id: dayDifference,
//         title: 'Test',
//         text: 'Test notification?',
//         trigger: {at: cDate}
//       };

//       this.notifications.push(notificationt);

    //}
    if (this.appProvider.isMobile()) {

      // Cancel any existing notifications
      this.localNotifications.cancelAll().then(() => {
        console.log('setReminders');
        // Schedule the new notifications
        this.localNotifications.schedule(notifications);
      //  this.notifications = [];
      });
      this.localNotifications.on('yes').subscribe(data => {
        console.log(data);
        alert(data);
      });
    }
  }

  ngOnInit() {
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
    this.latestStock = [];
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
  ionViewWillLeave() {
    this.unreadMsgSub.unsubscribe();
  }
}
