import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  segmentTab: any;
  page: number = 1;
  noDataFound:string = '';
  chatData : any = [];
  chatDataa : ({ "name": string; "image": string; "description": string; "count": string; "time": string; } | { "name": string; "image": string; "description": string; "time": string; "count"?: undefined; })[];

  constructor(private appProvider: CoreAppProvider, private curdService: CurdService) { }

  ngOnInit() {
    this.messages();
  }
  messages(){
    this.chatData = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('messages', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.chatData = [];
            } else {
              this.chatData = data;
              this.page = this.page + 1;
            }
            this.appProvider.dismissLoading();
          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            }
          );
      });
    });
  }
  segmentChanged(event){
    this.segmentTab = event.detail.value;
  }
  goforChat(chat) {

    let conversationId= '';
    if(chat.msg_to > chat.msg_from){
       conversationId = chat.msg_from+'_'+chat.msg_to;
    }else{
       conversationId = chat.msg_to+'_'+chat.msg_from;
    }

    this.appProvider.navTo('chats', conversationId, { queryParams: { product_id: chat.product_id, requested_quotes_id: chat.requested_quotes_id, msg_from:chat.msg_from,msg_to:chat.msg_to } });
  }
}
