import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
@Injectable({
  providedIn: 'root'
})
export class OnesignalnotificationService {

  constructor(private oneSignal: OneSignal) { }

  initOneSignalPush(){
    this.oneSignal.startInit('b2f7f966-d8cc-11e4-bed1-df8f05be55ba', '703322744261');
    
      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.endInit();
  }
}
