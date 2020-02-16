import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-request-quote',
  templateUrl: './request-quote.page.html',
  styleUrls: ['./request-quote.page.scss'],
})
export class RequestQuotePage implements OnInit {
  result: any;
  comment: any = '';
  product_id: string = '';
  user_id: string = '';
  img_base: string = CoreConfigConstant.uploadedPath;
  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider, 
    private route: ActivatedRoute, 
    public authenticationService: AuthenticationService) { 
      
    const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';
    this.route.params.subscribe((params) => {
      this.product_id = params['id'];
      this.user_id = params['user_id'];
    });
  }

  ngOnInit() {
    this.getProductDetail();
  }
  getProductDetail(){
    this.result = [];
    let stock = { 'product_id': this.product_id};
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.getData('getProduct', stock)
          .subscribe((data: any) => {

            if (data.status) {
              this.result = data;
              this.comment = '';
            } else {
              this.result = data;
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {
              this.appProvider.dismissLoading();
            }, 2000);

          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            },
            () => {
            }
          );
      });
    });
  }
  sendQuery() {
    if (this.product_id == '') {
      return;
    }
    if (this.user_id == '') {
      return;
    }
    if (this.comment == '') {
      this.appProvider.showToast('Query field is required.');
      return;
    }
    let stock = { 'product_id': this.product_id, 'msg_to': this.user_id, 'detail': this.comment };
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.postData('requestQuotes', stock)
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.data);
              this.comment = '';
            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {
              this.appProvider.dismissLoading();
            }, 2000);

          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            },
            () => {
            }
          );
      });
    });
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }

}
