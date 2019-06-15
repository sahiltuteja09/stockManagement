import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConfigServiceService } from 'src/config';
import { CoreAppProvider } from './providers/app';
import { AuthenticationService } from './pages/auth/authentication.service';

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
    },
    {
      title: 'Login/Register',
      url: '/login',
      icon: 'list'
    }
  ];
  public configs = null;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private configService: ConfigServiceService, 
    private appProvider: CoreAppProvider, 
    private authenticationService: AuthenticationService
  ) {
    this.initializeApp();
    
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
  logout(){
    this.authenticationService.logout();
  }
}
