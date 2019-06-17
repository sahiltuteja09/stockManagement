import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConfigServiceService } from 'src/config';
import { CoreAppProvider } from './providers/app';
import { AuthenticationService } from './pages/auth/authentication.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

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
      title: 'Setting',
      url: '/about',
      icon: 'list'
    }
  ];
  public configs = null;
  public loggedin = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private configService: ConfigServiceService, 
    private appProvider: CoreAppProvider, 
    private authenticationService: AuthenticationService,
    private router: Router
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
      setTimeout(() => {
        this.configs = this.configService.configValue;
        if(this.configs != undefined){
          if(this.configs.status == false){
          this.appProvider.showToast(this.configs.msg);
        }}
      }, 3000);
      
    });
  }
  menuControl(){
   this.loggedin = this.authenticationService.isLoggedin();
  }
  logout(){
    this.authenticationService.logout();
  }
}
