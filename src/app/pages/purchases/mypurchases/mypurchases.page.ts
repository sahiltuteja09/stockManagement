import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';

@Component({
  selector: 'app-mypurchases',
  templateUrl: './mypurchases.page.html',
  styleUrls: ['./mypurchases.page.scss'],
})
export class MypurchasesPage implements OnInit {
//https://ionicacademy.com/ionic-4-image-gallery-zoom/
  page: number = 1;
  mypurchases: any = [];
  lifeTimePurchase:any;
  noDataFound: string = 'Fetching records...';
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  isFiltered = false;
  constructor(
    private appProvider: CoreAppProvider, 
    private curdService: CurdService,
    private modalController: ModalController
    ) { }

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

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.purchases();
  }

  purchases() {
    this.mypurchases = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('myPurchases', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.mypurchases = [];
            } else {
              this.mypurchases = data;
              this.lifeTimePurchase = data.totalcost;
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
  goto(page,product) {

    this.appProvider.searchParam(page, { queryParams: { term:  product.marketplace_unique_id} });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.purchases();
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'page': this.page };
      this.curdService.getData('myProducts', param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.mypurchases.data.push(result.data[i]);
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

}
