import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CoreConfigConstant } from '../../../../configconstants'
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-productview',
  templateUrl: './productview.page.html',
  styleUrls: ['./productview.page.scss'],
})
export class ProductviewPage implements OnInit {

  product:any = {'product' : {
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
  },
  totalSold:0,
  totalReturn:0,
  totalLoss:0,
  totalDamage:0
};
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  isMobile:boolean = false;
  constructor(
    private appProvider: CoreAppProvider, 
    private modalController: ModalController, 
    public authenticationService: AuthenticationService) { 
      
    const currentUser = this.authenticationService.currentUserValue;
    let imgUserID = 0;
    if(currentUser != undefined)
         imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';
        this.isMobile = this.appProvider.isMobile();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let pDetail = this.appProvider.tempStorageData;
  
    if( pDetail == undefined || pDetail == null){
      this.appProvider.goto('myproducts',1);
    }else{
      this.product = [];
      this.product = pDetail;
    }
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
  editStock(){
    this.appProvider.goto('addnewstock/'+this.product.product.id);
  }
  ionViewWillLeave(){
   // if(!this.isMobile)
    this.appProvider.deleteStorage();
  }

}
