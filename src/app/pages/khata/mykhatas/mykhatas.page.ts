  import { Component, OnInit } from '@angular/core';
  import { CoreAppProvider } from 'src/app/providers/app';
  import { CurdService } from 'src/app/services/rest/curd.service';
  import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../../auth/authentication.service';
  @Component({
    selector: 'app-mykhatas',
    templateUrl: './mykhatas.page.html',
    styleUrls: ['./mykhatas.page.scss'],
  })
  export class MykhatasPage implements OnInit {
    page: number = 1;
    mykhatas: any = [];
    customerImages: any = [];
    lifetimePaid:any;
    lifetimeGot:any;
    noDataFound: string = 'Fetching records...';
    defaultImage: string = 'http://placehold.it/300x200';
    img_base: string = CoreConfigConstant.uploadedPath;
    isFiltered = false;
    keyword:string = '';
    constructor(
      private appProvider: CoreAppProvider, 
      private curdService: CurdService, public authenticationService: AuthenticationService
      ) { 
        const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';
      }
  
    ngOnInit() {
      
    }
    ionViewWillEnter() {
      this.khatas();
    }
    ionViewWillLeave() {
      this.appProvider.dismissLoading();
    }
  
    khatas() {
      this.isFiltered = false;
      this.mykhatas = [];
      this.page = 1;
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          let param = { 'page': this.page };
          this.curdService.getData('mykhatas', param)
            .subscribe((data: any) => {
              if (data.status == false) {
                // no product found
                this.noDataFound = data.msg;
                this.mykhatas = [];
                this.customerImages = [];
                this.lifetimePaid = data.you_paid;
                this.lifetimeGot = data.you_got;
              } else {
                this.mykhatas = data;
                this.lifetimePaid = data.you_paid;
                this.lifetimeGot = data.you_got;
                this.customerImages = data.customer_images;
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

    filterReport() {
      
      this.page = 1;
      this.isFiltered = true;
      let parameter = { 'page': this.page, 'keyword' : this.keyword };
      // this.appProvider.showLoading().then(loading => {
      //   loading.present().then(() => {
          this.curdService.getData('mykhatas', parameter)
            .subscribe((data: any) => {
  
              if (data.status == false) {
                this.mykhatas = [];
                //this.appProvider.showToast(data.msg);
                //this.noDataFound = data.msg;
              } else {
                this.mykhatas = [];
                this.mykhatas = data;
                this.lifetimePaid = data.you_paid;
                this.lifetimeGot = data.you_got;
                this.customerImages = data.customer_images;
                this.page = this.page + 1;
              }
              setTimeout(() => {
             //   this.appProvider.dismissLoading();
              }, 2000);
  
            },
              error => {
                this.appProvider.showToast(error);
            //    this.appProvider.dismissLoading();
              },
              () => {
              }
            );
      //   });
      // });
    }
    goto(page,khata) {
  let customerImg = this.customerImages[khata.mobile_number];
  if(!customerImg){
    customerImg = '';
  }
      this.appProvider.searchParam(page, { queryParams: { mobile:  khata.mobile_number, img:customerImg, 'name':khata.name, 'is_vendor':khata.is_vendor} });
    }
    navTo(page){
this.appProvider.goto(page)
    }
  
    doRefresh(event) {
      setTimeout(() => {
        if(this.isFiltered){
          this.filterReport();
        }else{
          this.khatas();
        }
        
        event.target.complete();
      }, 2000);
    }
    doInfinite(infiniteScroll) {
  
      setTimeout(() => {
        let param:any = { 'page': this.page };
        let apiMethod = 'mykhatas';
  
        if(this.isFiltered){
          param = { 'page': this.page, 'keyword' : this.keyword };
        }
        this.curdService.getData(apiMethod, param)
          .subscribe(
            (result: any) => {
              if (result.status == false) {
                
                // no product found
                this.noDataFound = result.msg;
              } else {
                for (let i = 0; i < result.data.length; i++) {
                  this.mykhatas.data.push(result.data[i]);
                }
                if(Object.keys(result.customer_images).length > 0)
                this.customerImages.push(result.customer_images);
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