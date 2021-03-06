import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../auth/authentication.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-khata',
  templateUrl: './khata.page.html',
  styleUrls: ['./khata.page.scss'],
})
export class KhataPage implements OnInit {
  name:string='';
  mobileNumber:string;
  queryParmSub: any;
  searchTerm:any;
  mykhata:any = [];
  page:number = 0;
  noDataFound:string = 'Record not found.';
  balance:number = 0;
  balance_text :string = '';
  customerImg:string = '';
  defaultImage: string = 'http://placehold.it/300x200';
  img_base: string = CoreConfigConstant.uploadedPath;
  marginTextImg:string = '';
  marginLeftTextImg:string = '';
  isVendor:number = 0;
  constructor( private route: ActivatedRoute, private appProvider: CoreAppProvider, private curdService: CurdService, 
    public authenticationService: AuthenticationService, 
    private modalController: ModalController
    ) { 
      const currentUser = this.authenticationService.currentUserValue;
      const imgUserID = currentUser.id;
      this.img_base = this.img_base + imgUserID + 'assets/'; 
    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['mobile'];
      this.customerImg = params['img'];
      this.isVendor = params['is_vendor'];

      this.name= params['name'];
       this.mobileNumber =params['mobile'];
    });

    if(this.searchTerm == undefined || this.searchTerm == ''){
      this.appProvider.goto('mykhatas');
    }
    
    if(!this.appProvider.isIos()){
      this.marginTextImg = '10px';
    }
    if(this.appProvider.isIos()){
      this.marginLeftTextImg = '10px';
    }
  }

  ngOnInit() {
   
  }
  ionViewWillEnter() {
    this.getKhata();
  }
  getKhata(){
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page, 'mobile_number':this.searchTerm };
        this.curdService.getData('mykhata', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.mykhata = [];
              this.balance_text = '';
              this.balance = 0;
            } else {
              this.mykhata = [];
              this.mykhata = data;
              this.page = this.page + 1;
              this.balance_text = data.balance_text;
              this.balance = data.balance;
              this.name= data.data[0].name;
              this.mobileNumber =data.data[0].mobile_number;
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

  doInfinite(infiniteScroll) {
  
    setTimeout(() => {
      let param:any = { 'page': this.page, 'mobile_number':this.searchTerm };
      let apiMethod = 'mykhata';

      this.curdService.getData(apiMethod, param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.mykhata.data.push(result.data[i]);
              }
              this.page = this.page + 1;
              this.balance_text = result.balance_text;
              this.balance = result.balance;
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
      infiniteScroll.target.complete();
    }, 2000);
  }
  khataView(item){
    item.name = this.name;
    item.img = this.customerImg;
    this.appProvider.tempData(item);console.log(item);
    this.appProvider.searchParam('khataview');
     //this.appProvider.navigateWithState('khataview', item);
  }
  editCustomer(){
    this.appProvider.tempData({ 'mobile':  this.searchTerm, 'name':this.name, 'img':this.customerImg, 'is_vendor':this.isVendor});
    this.appProvider.searchParam('addcustomer', { queryParams: { 'mobile':  this.searchTerm, 'name':this.name, 'img':this.customerImg, 'is_vendor':this.isVendor} });
  }
  addkhata(type:number){
    this.appProvider.tempData({'name':this.name,'khata_id':0, 'type':type, 'mobile': this.searchTerm, 'amount': 0,'description': '',purchase_date:new Date().toISOString()});
    this.appProvider.searchParam('addkhata');
  }
  ionViewWillLeave() {
      this.queryParmSub.unsubscribe();
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

}
