import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-quote',
  templateUrl: './request-quote.page.html',
  styleUrls: ['./request-quote.page.scss'],
})
export class RequestQuotePage implements OnInit {
  comment:any = '';
  product_id:string = '';
   constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider, private route: ActivatedRoute
   ) { 
    this.route.params.subscribe( (params) => {this.product_id =  params['id']});
   }

  ngOnInit() {
  }
  sendQuery(){
    console.log(this.product_id);
    if (this.comment == '') {
      this.appProvider.showToast('Query field is required.');
      return;
    }
    let stock = {'product_id': '','request_to':'','':'', 'detail': this.comment};
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.postData('updateStock', stock)
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

}
