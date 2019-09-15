import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from '../rest/curd.service';

@Injectable({
  providedIn: 'root'
})
export class LocalnotificationService {

  notificationSound: string = 'file://assets/sound/bell.mp3';
  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
    private localNotifications: LocalNotifications
  ) {
    if (this.appProvider.isMobile()) {
      this.notificationSound = this.appProvider.isIos() ? 'file://src/assets/sound/notification.m4r' : 'file://src/assets/sound/bell.mp3';
    }

  }

  stockReminder() {
    if (this.appProvider.isMobile()) {
      console.log('is Mobile');
      // check local notification permission
      this.localNotifications.hasPermission().then((hasPermission) => {
        console.log('hasPermission ' + hasPermission);
        if (hasPermission) {
          this.isLocalNotificationIsScheduled();
        } else {
          console.log('requestPermission ');
          this.localNotifications.requestPermission().then((granted) => {
            console.log('requestPermission ' + granted);
            if (granted) {
              this.isLocalNotificationIsScheduled();
            }
          });
        }

      });
    }
  }

  // check if already scheduled local notifications
  isLocalNotificationIsScheduled() {
    this.localNotifications.getScheduledIds().then((ids) => {
      // let isScheduled = Array.isArray(ids);
      if (ids.length == 0) {
        this.setReminders();
      }
    }).catch((err) => { console.log('isLocalNotificationIsScheduled '); console.log(err); });
  }
  // set local notification for week and 3 time is a day
  setReminders() {
    let notifications =
      [
        {
          id: 1,
          title: 'Today Stock',
          text: 'A reminder to update the today stock.',
          trigger: { count: 1, every: { hour: 12, minute: 10 } },
          foreground: true,
          launch: true,
          vibrate: true,
          badge: 1,
          sound: this.notificationSound
        },
        {
          id: 2,
          title: 'Stock Update Reminder',
          text: 'Hey! Any updates on stock?',
          trigger: { count: 1, every: { hour: 18, minute: 10 } },
          foreground: true,
          launch: true,
          vibrate: true,
          badge: 1,
          sound: this.notificationSound
        },
        {
          id: 3,
          title: 'Stock verify',
          text: 'Hey! Have you check today reports ?',
          trigger: { count: 1, every: { hour: 20, minute: 10 } },
          foreground: true,
          launch: true,
          vibrate: true,
          badge: 1,
          sound: this.notificationSound
        }
        // ,
        // {
        //   id: new Date().getTime(),
        //   title: 'Test',
        //   text: 'Hey! Have you check today reports ?',
        //   trigger: {count: 1, at: new Date(new Date().getTime() + 20000)},
        //     foreground: true,
        //     launch: true,
        //     badge: 1,
        //     vibrate: true,
        //     "sound": 'file://assets/sound/bell.mp3',
        //     attachments: ['file://assets/chat/chat1.jpg'],
        // }
      ];
    this.localNotifications.on('click').subscribe(data => {
      console.log(data);
    });
    this.localNotifications.schedule(notifications);
    // Cancel any existing notifications
    // this.localNotifications.cancel(1).then(() => {
    //   this.localNotifications.cancel(2).then(() => {
    //     this.localNotifications.cancel(3).then(() => {
    //       // Schedule the new notifications
    //       this.localNotifications.schedule(notifications);
    //     });
    //   });
    // });


  }

  stockQuantityNotification() {
    if (!this.appProvider.isMobile()) { return; }
    this.curdService.getData('quantityLow')
      .subscribe((data: any) => {

        this.localNotifications.isScheduled(4).then((isScheduled) => {

          if (!isScheduled && data.status) {
            this.setQuantityReminder(data, 0);
          } else if (isScheduled && data.status) {
            this.setQuantityReminder(data, 1);
          }

        });

      }
      );
  }

  setQuantityReminder(data, update) {
    let notifications =
      [
        {
          id: 4,
          title: data.title,
          text: data.data,
          trigger: { count: 1, every: { hour: 21, minute: 10 } },
          foreground: true,
          launch: true,
          vibrate: true,
          badge: 1,
          sound: this.notificationSound
        },
        {
          id: 5,
          title: data.title,
          text: data.data,
          trigger: { count: 1, every: { hour: 10, minute: 10 } },
          foreground: true,
          launch: true,
          vibrate: true,
          badge: 1,
          sound: this.notificationSound
        }
      ];
    if (update == 0) {
      console.log('in insert');
      this.localNotifications.schedule(notifications);
    } else {
      console.log('in updates');
      this.localNotifications.update(notifications[0]);
      this.localNotifications.update(notifications[1]);
    }
  }

  sendNotification(msg) {
    if (this.appProvider.isMobile()) {
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 101,
        text: msg,
        vibrate: true,
        foreground: true,
        sound: this.notificationSound,
        trigger: { count: 1 }
      });
    }
  }

}
