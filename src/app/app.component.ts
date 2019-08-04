import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConfigServiceService } from 'src/config';
import { CoreAppProvider } from './providers/app';
import { AuthenticationService } from './pages/auth/authentication.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Products',
      url: '/myproducts',
      icon: 'list'
    },
    {
      title: 'Stock In',
      url: '/stockin',
      icon: 'list'
    },
    {
      title: 'Stock Out',
      url: '/stockout',
      icon: 'list'
    },
    {
      title: 'Reports',
      url: '/sale',
      icon: 'list'
    },
    {
      title: 'My Quotes',
      url: '/myquotes',
      icon: 'list'
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: 'list'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'list'
    }
  ];
  public configs = null;
  public loggedin = false;

  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private configService: ConfigServiceService,
    private appProvider: CoreAppProvider,
    private authenticationService: AuthenticationService,
    private router: Router, private route: ActivatedRoute,
    private location: Location,
    public events: Events
  ) {
    this.initializeApp();
    router.events.subscribe((event: Event) => {
      this.loggedin = this.authenticationService.isLoggedin();
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();


      this.checkNetworkStatus();
      setTimeout(() => {
        this.configs = this.configService.configValue;
        if (this.configs != undefined) {
          if (this.configs.status == false) {
            this.appProvider.showToast(this.configs.msg);
          }
        }
      }, 3000);

    });
  }

  checkNetworkStatus() {
    this.appProvider.initializeNetworkEvents();
    console.log(this.router.routerState.snapshot.url);
    this.events.subscribe('network:offline', () => {
      if (this.router.url != '/no-internet') {
        let routePage = this.router.routerState.snapshot.url;
        if (this.router.routerState.snapshot.url) {
          this.router.navigate(['/no-internet'], { queryParams: { returnUrl: routePage } });
        } else {
          this.router.navigate(['/no-internet']);
        }
      }

    });
    this.events.subscribe('network:online', () => {
      if (this.router.url == '/no-internet') {
        // get param
        let redirectUrl = this.route.snapshot.queryParams["returnUrl"];
        console.log('redirectUrl '+redirectUrl);
        if (redirectUrl) {
          this.router.navigate(['/' + redirectUrl]);
        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }
  exitApp() {
    this.platform.backButton.subscribe(async () => {
      // this does work
      if (this.router.url === '/' || this.router.url == '/home') {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          // this.platform.exitApp(); // Exit from app
          navigator['app'].exitApp(); // work in ionic 4

        } else {
          this.appProvider.showToast('Press back again to exit App.');
          this.lastTimeBackPress = new Date().getTime();
        }
      } else {
        this.location.back();
      }
    });
  }
  menuControl() {
    this.loggedin = this.authenticationService.isLoggedin();
  }
  logout() {
    this.authenticationService.logout();
  }
}
