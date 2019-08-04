import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreAppProvider } from 'src/app/providers/app';
@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {

  constructor(private router: Router, private appProvider: CoreAppProvider) { }

  ngOnInit() {
  }

  isOnline() {
    this.appProvider.showLoading().then(loading => {
      setTimeout(() => {
        this.appProvider.dismissLoading();
      }, 2000);
    });
    let isOnline = this.appProvider.isOnline(); console.log('isOnline ' + isOnline);
    if (isOnline) {
      this.router.navigate(['/home']);
    }
  }

}