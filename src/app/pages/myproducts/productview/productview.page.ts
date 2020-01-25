import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CoreConfigConstant } from '../../../../configconstants'
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-productview',
  templateUrl: './productview.page.html',
  styleUrls: ['./productview.page.scss'],
})
export class ProductviewPage implements OnInit {

  product:any = [];
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;

  constructor(private appProvider: CoreAppProvider, private modalController: ModalController) { }

  ngOnInit() {
   this.product = this.appProvider.tempStorage;
   if(!this.product){
    this.product.product = {
    'id': "",
    'user_id': "0",
    'image': "",
    'title': "",
    'description': "",
    'purchase_cost': "",
    'quantity': "0",
    'likes': "0",
    'product_placed': "na",
    'date_added': "2019-08-24 09:56:22",
    'marketplace_unique_id': ""
    };
    this.product.totalSold = '0';
    this.product.totalReturn = '0';
    this.product.totalLoss = '0';
    this.product.totalDamage = '0';
   }
   console.log(this.product);
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
  goto(page) {

    this.appProvider.searchParam(page, { queryParams: { term:  this.product.product.marketplace_unique_id} });
  }

}
