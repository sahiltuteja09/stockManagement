import { Component, OnInit } from '@angular/core';
  import { CoreAppProvider } from 'src/app/providers/app';
  import { CurdService } from 'src/app/services/rest/curd.service';
  import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../../auth/authentication.service';
@Component({
  selector: 'app-my-vendors',
  templateUrl: './my-vendors.page.html',
  styleUrls: ['./my-vendors.page.scss'],
})
export class MyVendorsPage implements OnInit {

  page: number = 1;
  myVendors: any = [];
    
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
      //from enter to init
      this.vendors();
    }
    ionViewWillLeave() {
      this.appProvider.dismissLoading();
    }
  
    vendors() {
      this.isFiltered = false;
      this.myVendors = [];
      this.page = 1;
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          let param = { 'page': this.page };
          this.curdService.getData('myVendors', param)
            .subscribe((data: any) => {
              if (data.status == false) {
                // no product found
                this.noDataFound = data.msg;
                this.myVendors = [];
              } else {
                this.myVendors = data;
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
          this.curdService.getData('myVendors', parameter)
            .subscribe((data: any) => {
  
              if (data.status == false) {
                this.myVendors = [];
                //this.appProvider.showToast(data.msg);
                //this.noDataFound = data.msg;
              } else {
                this.myVendors = [];
                this.myVendors = data;
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
    goto(page,vendor) {
      this.appProvider.searchParam(page, { queryParams: { mobile:  vendor.mobile_number, name:vendor.name } });
    }
  
    doRefresh(event) {
      setTimeout(() => {
        if(this.isFiltered){
          this.filterReport();
        }else{
          this.vendors();
        }
        
        event.target.complete();
      }, 2000);
    }
    doInfinite(infiniteScroll) {
  
      setTimeout(() => {
        let param:any = { 'page': this.page };
        let apiMethod = 'myVendors';
  
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
                  this.myVendors.data.push(result.data[i]);
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
