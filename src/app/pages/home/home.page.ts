import { Component } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Events, ToastController } from '@ionic/angular';
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
  imgBase:string = '';
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
    private oneSignalService: OnesignalnotificationService,
    public toastController: ToastController
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    this.userID = currentUser.id;
    this.imgBase = this.img_base;
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
  showAddToHomeBtn: boolean = true;
  deferredPrompt;
  ionViewWillEnter() {
    this.stockLatest();
    (<any>window).addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later on the button event.
      this.deferredPrompt = e;
       
    // Update UI by showing a button to notify the user they can add to home screen
      
      if(this.showAddToHomeBtn){
        this.addToHomeTost() ;
        this.showAddToHomeBtn = false;
      }
      
    });
     
    //button click event to show the promt
             
    (<any>window).addEventListener('appinstalled', (event) => {
      console.log('installed');
     // this.appProvider.showToast('Thank you');
    });
     
     
    if ((<any>window).matchMedia('(display-mode: standalone)').matches) {
      console.log('display-mode is standalone');
    }
  }

  async addToHomeTost() {
    const toast = await this.toastController.create({
      showCloseButton: true,
      closeButtonText: 'Ok',
      animated:true,
      message: 'Click "ADD" to get full screen mode and faster loading..',
      position: 'bottom',
     
    });
    toast.present();

    toast.onWillDismiss().then(() => {
      this.add_to_home();
    });
  }
  add_to_home(){
    debugger
    // hide our user interface that shows our button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the prompt');
        } else {
          this.showAddToHomeBtn = true;
          console.log('User dismissed the prompt');
        }
        this.deferredPrompt = null;
      });
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
