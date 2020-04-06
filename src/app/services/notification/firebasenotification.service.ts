import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { CurdService } from '../rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class FirebasenotificationService {
deviceType:string = 'android';
public msgData$: EventEmitter<any>;
public counter$: EventEmitter<any>;
  constructor(
    private curdService: CurdService,
    public firebaseX: FirebaseX
    ) {
     //this.deviceType =  this.appProvider.isIos() ? 'ios' : 'android';
     this.msgData$ = new EventEmitter();
     this.counter$ = new EventEmitter();
     }

    initPush(){
      this.firebaseX.getToken()
        .then(token => {
          console.log(`The token is ${token}`); 
          this.firebaseX.createChannel({'id': CoreConfigConstant.appName,sound: "my_sound",'importance':4, badge: true,visibility: 1});
        this.updatePlayerId(token); }) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));

        this.firebaseX.onTokenRefresh()
          .subscribe((token: string) => {console.log(`The token is ${token}`); this.updatePlayerId(token); });

          this.firebaseX.onMessageReceived()
            .subscribe(data => {
              console.log(`User opened a notification ${data}`);
              console.log(data);
              this.msgData$.emit(data);
          } );
     }
    updatePlayerId(player_id){

      this.curdService.postData('updatePlayerId', { 'player_id': player_id})
      .subscribe((data: any) => {},
        error => {},
        () => {}
      );
    }

    checkUpdates() {
      this.curdService.getData('unreadMsg')
        .subscribe((data: any) => {
          if (data.status) {
            this.counter$.emit(data.data);
          }else{
            this.counter$.emit(0)
          }
        }
        );
    }
}
