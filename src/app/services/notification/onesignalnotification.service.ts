import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { CoreConfigConstant } from 'src/configconstants';
import { CurdService } from '../rest/curd.service';
import { CoreAppProvider } from 'src/app/providers/app';
@Injectable({
  providedIn: 'root'
})
export class OnesignalnotificationService {

  constructor(
    private oneSignal: OneSignal,
    private curdService: CurdService,
    private appProvider: CoreAppProvider
    ) { }
  initOneSignalPush(){
   if(!this.appProvider.isMobile()){
return;
   }
    this.oneSignal.startInit(CoreConfigConstant.oneSIgnalSecretKey, CoreConfigConstant.oneSIgnalSecretId);
    
      this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
      });

      this.oneSignal.getIds().then(identity => {
        console.log('identity');
        console.log(identity);
        this.updatePlayerId(identity.userId)
    });

      this.oneSignal.endInit();
  }
  updatePlayerId(player_id){

    this.curdService.postData('updatePlayerId', { 'player_id': player_id })
    .subscribe((data: any) => {

      if (data.status) {
      } else {
      }

    },
      error => {
        this.appProvider.showToast(error);
        this.appProvider.dismissLoading();
      },
      () => {
      }
    );

  }
}
