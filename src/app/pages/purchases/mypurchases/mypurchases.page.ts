import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants';
import { ModalController } from '@ionic/angular';
import { ImageModalPage } from '../../image-modal/image-modal.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocalnotificationService } from 'src/app/services/notification/localnotification.service';
import { AuthenticationService } from '../../auth/authentication.service';
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

  startDate:string = new Date().toISOString();
  endDate: any = new Date().toISOString();
  startDate_date_format:string = '';
  endDate_date_format:string = '';
  keyword:string = '';
  selectedValue: string[];

  isMobile:boolean = false;
  downloadPath:string = '';
  isAndroid: boolean = false;
  downloadFolder:string = 'Download';
  zipFileName:string = '';
  constructor(
    private appProvider: CoreAppProvider, 
    private curdService: CurdService,
    private modalController: ModalController,
    private callNumber: CallNumber,
    private transfer: FileTransfer, 
     private file: File,
     private androidPermissions: AndroidPermissions,
     private localNotification: LocalnotificationService, 
     public authenticationService: AuthenticationService) { 
       
     const currentUser = this.authenticationService.currentUserValue;
         const imgUserID = currentUser.id;
         this.img_base = this.img_base + imgUserID + 'assets/';
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

  ngOnInit() {
    this.isMobile = this.appProvider.isMobile();
    this.isAndroid = this.appProvider.isAndroid();
    if(this.isAndroid){
      this.downloadPath = this.file.externalRootDirectory;
    }else{
      this.downloadPath = this.file.documentsDirectory;
    }
  }
  ionViewWillEnter() {
    this.purchases();
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }

  purchases() {
    this.isFiltered = false;
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
  clearFileter(){
    this.isFiltered = false;
    this.startDate= '';
    this.endDate= '';
    this.keyword= '';
    this.purchases();
  }
  filterReport() {
    this.mypurchases = [];
    this.isFiltered = true;
    this.page = 1;
    let parameter = this.formatData();
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.getData('filterBillReport', parameter)
          .subscribe((data: any) => {

            if (data.status == false) {
              this.appProvider.showToast(data.msg);
              this.noDataFound = data.msg;
            } else {
              this.mypurchases = data;
              this.lifeTimePurchase = data.totalcost;
              this.page = this.page + 1;
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
  formatData(){
    if (this.startDate) {
      var startdate = new Date(this.startDate);
      this.startDate_date_format = startdate.getFullYear() + '-' + (startdate.getMonth() < 10 ? '0' + ((startdate.getMonth()) * 1 + 1) : ((startdate.getMonth()) * 1 + 1)) + '-' + (startdate.getDate() < 10 ? '0' + startdate.getDate() : startdate.getDate());
    }else{
     // this.appProvider.showToast('The start date field is required.');
    //  return false;
    }

    if (this.endDate) {
      var enddate = new Date(this.endDate);
      this.endDate_date_format = enddate.getFullYear() + '-' + (enddate.getMonth() < 10 ? '0' + ((enddate.getMonth()) * 1 + 1) : ((enddate.getMonth()) * 1 + 1)) + '-' + (enddate.getDate() < 10 ? '0' + enddate.getDate() : enddate.getDate());
    }else{
     // this.appProvider.showToast('The end date field is required.');
   //   return false;
    }

    let parameter = { 'fromDate': this.startDate_date_format, 'toDate': this.endDate_date_format, 'keyword': this.keyword, 'page':this.page };
    return parameter;
  }
  goto(page,product) {

    this.appProvider.searchParam(page, { queryParams: { term:  product.marketplace_unique_id},skipLocationChange: true });
  }
  gotoPage(page) {

    this.appProvider.searchParam(page);
  }

  doRefresh(event) {
    setTimeout(() => {
      if(this.isFiltered){
        this.filterReport();
      }else{
        this.purchases();
      }
      
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param:any = { 'page': this.page };
      let apiMethod = 'myPurchases';

      if(this.isFiltered){
        apiMethod = 'filterBillReport';
        param = this.formatData();
      }
      this.curdService.getData(apiMethod, param)
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

  callToVendor(number:any){
   if( this.appProvider.isMobile() ){
    this.callNumber.callNumber(number, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
    }
  }
  purchaseview(data:any){
    this.appProvider.navigateWithState('purchasesview', data);
  }
  
  selectedValues(){
    let items = this.mypurchases.data;
    const checkedOptions = items.filter(x => x.checked);
    this.selectedValue = checkedOptions.map(x => x.id);
    //this.selectedValue = checkedOptions.map(x => x.image);
  }
  
  bulkDownload(){
    if( typeof this.selectedValue == 'undefined' || Object.keys(this.selectedValue).length === 0){
      this.appProvider.showToast('Please select a bill to download.');
      return false;
    }
    if(!this.isMobile)
    return false;

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        console.log(status);
        if (status.hasPermission) {
          this.createZip();
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(status => {
              console.log(status);
              if(status.hasPermission) {
                this.createZip();
              }
            });
        }
      });
  }

  createZip() {
  
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.postData('bulkDownloadBills', {'purchase_ids': this.selectedValue } )
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.msg);
              this.zipFileName = this.img_base + data.zipname +'.zip';
              if(this.isMobile)
              this.downloadFile();
            } else {
              this.appProvider.showToast(data.msg);
            }
            this.appProvider.dismissLoading();

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
  
  downloadFile() {
  
    this.file.checkDir(this.downloadPath , this.downloadFolder).then(response => {
      console.log('Directory exists'+response);
      this.downloadBill();
    }).catch(err => {
      console.log('Directory doesn\'t exist'+JSON.stringify(err));
      this.file.createDir(this.downloadPath ,this.downloadFolder , false).then(response => {
        console.log('Directory create'+response);
        this.downloadBill();
      }).catch(err => {
        console.log('Directory no create'+JSON.stringify(err));
      }); 
    });
  
    
  }
  downloadBill(){
    let imageURL = this.zipFileName;
    console.log(imageURL);
    const dot = imageURL.lastIndexOf('.');
    let ext = '';
    if (dot > -1) {
      ext = imageURL.substr(dot + 1).toLowerCase();
    }
  
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
  
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(imageURL, this.downloadPath  + 
      '/'+this.downloadFolder+'/' + "bill-"+Math.round(Math.random() * 10000) +"."+ext, true).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.appProvider.dismissLoading();
      this.appProvider.showToast('Your bill has been downloaded successfully in your '+this.downloadFolder + ' folder.');
      this.localNotification.sendNotification('Your bill has been downloaded successfully in your '+this.downloadFolder + ' folder.');
    }, (error) => {
      // handle error
      console.log(error);
      this.appProvider.dismissLoading();
      this.appProvider.showToast('Sorry!! Unable to download the bill.');
     
    });
    });
  });
  }

}
