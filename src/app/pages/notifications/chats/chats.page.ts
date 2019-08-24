import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { AuthenticationService } from '../../auth/authentication.service';
@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  @ViewChild('latestFetchid') latestFetchid: ElementRef;
  @ViewChild('firstFetchid') firstFetchid: ElementRef;

  userID = 2;
  uname: string = '';

  phone_model = 'iPhone';
  input = '';

  defaultImg_sender: string = 'assets/chat/sg2.jpg';
  defaultImg_reciver: string = 'assets/chat/user3.jpeg';

  conversation: any = [];
  conversationId = '';
  product_id = '';
  requested_quotes_id = '';
  reciver_id: number;

  routSub: any;
  queryParmSub: any;
  checkHeartbeat;
  sending_text:string = 'SEND';

  // Prevent memory leaks
  ngOnDestroy() {
    this.routSub.unsubscribe();
    this.queryParmSub.unsubscribe();
    this.deactivateChatMonitor();
  }
  ionViewWillLeave(){
    this.deactivateChatMonitor();
  }
  constructor(
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    public alertController: AlertController,
    private device: Device, private platform: Platform,
    private route: ActivatedRoute, private authenticationService: AuthenticationService) {

    const currentUser = this.authenticationService.currentUserValue;

    this.userID = currentUser.id;
    this.uname = currentUser.username;
  }

  ngOnInit() {
    if (this.device.platform = 'iOS') {
      switch (this.platform.height()) {
        case 812:
          this.phone_model = 'iPhone X';
          break;
        case 736:
          this.phone_model = 'iPhone 6/7/8 Plus';
          break;
        case 667:
          this.phone_model = 'iPhone 6/7/8';
          break;
      }
    }

    this.routSub = this.route.params.subscribe((params) => {
      this.conversationId = params['conversationId'];

    });

    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.product_id = params['product_id'];
      this.requested_quotes_id = params['requested_quotes_id'];
      if (params['msg_to'] == this.userID) {
        this.reciver_id = params['msg_from'];
      } else if (params['msg_from'] == this.userID) {
        this.reciver_id = params['msg_to'];
      }
    });
    this.chats();
  }



  ionViewDidEnter() {
    //this.menuCtrl.enable(false, 'end');
   // this.menuCtrl.enable(true, 'start');

    setTimeout(() => {
      this.scrollToBottom()
    }, 10)
  }

  chats() {

    this.conversation = [];
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'conversationId': this.conversationId, 'last_fetch_id': 0 };
        this.curdService.getData('getChats', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.conversation = [];
            } else {
              this.conversation = data.data;
              setTimeout(() => {
                this.scrollToBottom()
              }, 10)
            }
            this.appProvider.dismissLoading();
            this.activateChatMonitor();
          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            }
          );
      });
    });
  }


  send() {
    if (!this.reciver_id) {
      this.appProvider.showToast('Something went wrong.Please try again.');
      return false;
    }
    if (this.input != '') {
      this.deactivateChatMonitor();
      this.sending_text = 'SENDING...';
     // this.conversation.push({ comment: this.input, msg_from: this.userID, mark_read: 0, image: 'assets/chat/sg1.jpg', sender_name: this.uname });

      let data = { 'product_id': this.product_id, 'comment': this.input, 'price': 0, 'msg_from': this.userID, 'msg_to': this.reciver_id, 'requested_quotes_id': this.requested_quotes_id };
      this.curdService.postData('sendNotification', data)
        .subscribe((data: any) => {
          if (data.status == false) {
            this.appProvider.showToast(data.msg);
          } else {
            for (let i = 0; i < data.data.length; i++) {
              this.conversation.push(data.data[i]);
            }
            setTimeout(() => {
              this.scrollToBottom();
            }, 10)
          }
          this.activateChatMonitor();
          this.sending_text = 'SEND';
        },
          error => {
            this.appProvider.showToast(error);
            this.appProvider.dismissLoading();
            this.activateChatMonitor();
          this.sending_text = 'SEND';
          },
          () => {
            this.sending_text = 'SEND';
          }
        );
      this.input = '';
      setTimeout(() => {
        this.scrollToBottom()
      }, 10)
    }
  }
  
  activateChatMonitor(){
    this.checkHeartbeat = setInterval(() => {
      this.getRealTimeChat()
    }, 5000)
  }
  deactivateChatMonitor(){
    clearInterval(this.checkHeartbeat);
  }
  getRealTimeChat() {
    let param = { 'conversationId': this.conversationId, latestFetchid: this.latestFetchid.nativeElement.value };
    this.curdService.getData('getRealTimeChat', param)
      .subscribe((data: any) => {
        if (data.status == false) {
        } else {
          
          for (let i = 0; i < data.data.length; i++) {
            this.conversation.push(data.data[i]);
          }
          setTimeout(() => {
            this.scrollToBottom()
          }, 15)
        }
        this.appProvider.dismissLoading();
      },
        error => {
         this.deactivateChatMonitor();
          this.appProvider.showToast(error);
          this.appProvider.dismissLoading();
        }
      );
  }

  scrollToBottom() {
    let content = document.getElementById("chat-container");
    let parent = document.getElementById("chat-parent");
    let scrollOptions = {
      left: 0,
      top: content.offsetHeight
    }

    parent.scrollTo(scrollOptions)
  }

  doRefresh(event) {
   this.deactivateChatMonitor();
   
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'conversationId': this.conversationId, 'last_fetch_id': this.firstFetchid.nativeElement.value };
        this.curdService.getData('getChats', param)
          .subscribe((data: any) => {
            if (data.status == false) {
            } else {
              let conversations =  data.data;
              let recentConversations = this.conversation;
              this.conversation = conversations.concat(recentConversations);
            }
            event.target.complete();
            this.appProvider.dismissLoading();
            this.activateChatMonitor();
          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            }
          );
      });
    });


  }

}
