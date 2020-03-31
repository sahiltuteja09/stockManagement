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
recentProducts:any = [];
recentTransactions:any = [];
customerImages: any = [];
recentPurchasess:any = [];
vendors:any = [];
recentUpdates:any = [];

recentProductsStatus:boolean = false;
recentTransactionsStatus:boolean = false;
recentPurchasessStatus:boolean = false;
vendorsStatus:boolean = false;
recentUpdatesStatus:boolean = false;

 slideOpts = {
  initialSlide: 1,
  speed: 400,
  slidesPerView:3,
  slidesPerGroup: 3,
};
pslideOpts = {
  initialSlide: 1,
  speed: 400,
  slidesPerView:2,
  slidesPerGroup: 2,
};
uslideOpts = {
  initialSlide: 1,
  speed: 400,
  slidesPerView:1,
  slidesPerGroup: 1,
};

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

    if(!this.appProvider.isMobile()){
      this.slideOpts = {
        initialSlide: 1,
        speed: 400,
        slidesPerView:8,
        slidesPerGroup: 8,
      };
      this.pslideOpts = {
        initialSlide: 1,
        speed: 400,
        slidesPerView:6,
        slidesPerGroup: 6,
      };
      this.uslideOpts = {
        initialSlide: 1,
        speed: 400,
        slidesPerView:3,
        slidesPerGroup: 3,
      };
    }
  }

  

  ngOnInit() {
    
  }
  showAddToHomeBtn: boolean = true;
  deferredPrompt;
  ionViewWillEnter() {
   this.oneSignalService.initOneSignalPush();
   this.home();

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

  home() {
    this.appProvider.dismissLoading();
    
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.getData('appHome')
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
            } else {
             ;
              if(data.products.status){
             this.recentProducts = data.products.data;
             this.recentProductsStatus = true
              }
             else{
             this.recentProductsStatus = false;
             }

             if(data.recent_transactions.status){
             this.recentTransactions = data.recent_transactions.data;
             this.customerImages = data.recent_transactions.customer_images;
             this.recentTransactionsStatus = true;
             }else{
             this.recentTransactionsStatus = false;
             }

             if(data.purchase.status){
             this.recentPurchasess = data.purchase.data;
             this.recentPurchasessStatus = true;
             }else{
             this.recentPurchasessStatus = false;
             }

             if(data.purchase.status){
             this.vendors = data.vendors.data;
             this.vendorsStatus = true;
             }else{
             this.vendorsStatus = false;
             }

             if(data.recent_updates.status){
             this.recentUpdates = data.recent_updates.data;
             this.recentUpdatesStatus = true;
             }else{
             this.recentUpdatesStatus = false;
             }
            }
            console.log(data);
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
  doRefresh(event) {
    setTimeout(() => {
      this.home();
      event.target.complete();
    }, 2000);
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
  navto(page) {
    this.appProvider.goto(page);
  }
  ionViewWillLeave() {
    this.unreadMsgSub.unsubscribe();
    this.appProvider.dismissLoading();
  }
}
