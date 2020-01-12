import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from '../../../../configconstants';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-requestbymequotes',
  templateUrl: './requestbymequotes.page.html',
  styleUrls: ['./requestbymequotes.page.scss'],
})
export class RequestbymequotesPage implements OnInit {

  page: number = 1;
  myquotes: any = [];
  noDataFound: string = 'Fetching records...';
  defaultImage:string = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  img_base: string = CoreConfigConstant.uploadedPath;
  constructor(private appProvider: CoreAppProvider, private curdService: CurdService, private modalController: ModalController) { }

  ngOnInit() {
    this.myQuotes();
  }

  myQuotes() {
    this.myquotes = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('myQuotes', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.myquotes = [];
            } else {
              this.myquotes = data;
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

    let conversationId= '';
    if(chat.msg_to > chat.msg_from){
       conversationId = chat.msg_from+'_'+chat.msg_to;
    }else{
       conversationId = chat.msg_to+'_'+chat.msg_from;
    }

    this.appProvider.navTo('chats', conversationId, { queryParams: { product_id: chat.product_id, requested_quotes_id: chat.requested_quotes_id, msg_from:chat.msg_from,msg_to:chat.msg_to } });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.myQuotes();
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'page': this.page };
      this.curdService.getData('myQuotes', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.myquotes.data.push(result.data[i]);
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
  openPreview(img) {
    this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        img: img
      }
    }).then(modal => {
      modal.present();
    });
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }
}
