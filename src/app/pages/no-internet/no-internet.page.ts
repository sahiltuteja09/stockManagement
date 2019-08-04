import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreAppProvider } from 'src/app/providers/app';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {
onlineSub;
  constructor(private route: ActivatedRoute,public events: Events, private router: Router, private appProvider: CoreAppProvider) {
   }

  ngOnInit() {
  }

  isOnline() {
    this.appProvider.showLoading().then(loading => {
      setTimeout(() => {
        this.appProvider.dismissLoading();
      }, 2000);
    });
    let isOnline = this.appProvider.isOnline();
    console.log('isOnline ' + isOnline);
    if (isOnline) {
      let redirectUrl = this.route.snapshot.queryParams["returnUrl"];
      console.log('redirectUrl ' + redirectUrl);
      if (redirectUrl) {
        this.router.navigate([ redirectUrl]);
      } else {
        this.router.navigate(['/home']);
      } 
    }
  }
  
}