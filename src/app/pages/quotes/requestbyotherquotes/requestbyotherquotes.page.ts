import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';

@Component({
  selector: 'app-requestbyotherquotes',
  templateUrl: './requestbyotherquotes.page.html',
  styleUrls: ['./requestbyotherquotes.page.scss'],
})
export class RequestbyotherquotesPage implements OnInit {

  page: number = 1;
  otherquotes: any = [];
  noDataFound: string = 'Fetching records...';
  constructor(private appProvider: CoreAppProvider, private curdService: CurdService) { }

  ngOnInit() {
    this.otherQuotes();
  }

  otherQuotes() {
    this.otherquotes = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('otherQuotes', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.otherquotes = [];
            } else {
              this.otherquotes = data;
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
  gotoChat(chat) {

    let conversationId = '';
    if (chat.msg_to > chat.msg_from) {
      conversationId = chat.msg_from + '_' + chat.msg_to;
    } else {
      conversationId = chat.msg_to + '_' + chat.msg_from;
    }

    this.appProvider.navTo('chats', conversationId, { queryParams: { product_id: chat.product_id, requested_quotes_id: chat.requested_quotes_id, msg_from: chat.msg_from, msg_to: chat.msg_to } });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.otherquotes();
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'page': this.page };
      this.curdService.getData('otherQuotes', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.otherquotes.data.push(result.data[i]);
              }
              this.page = this.page + 1;
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
      infiniteScroll.target.complete();
    }, 2000);
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }
}
