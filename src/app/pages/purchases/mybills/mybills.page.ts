import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { LocalnotificationService } from 'src/app/services/notification/localnotification.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { CoreConfigConstant } from 'src/configconstants'
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-mybills',
  templateUrl: './mybills.page.html',
  styleUrls: ['./mybills.page.scss'],
})
export class MybillsPage implements OnInit {
  mybills:any = [];
  page:number = 1;
  noDataFound:string = 'Bill not generated yet.';
  isMobile:boolean = false;
  downloadPath:string = '';
  isAndroid: boolean = false;
  downloadFolder:string = 'Download';
  zipFileName:string='';
  img_base:string= CoreConfigConstant.uploadedPath;
  constructor(public appProvider : CoreAppProvider, public curdService: CurdService,private androidPermissions: AndroidPermissions,
    private localNotification: LocalnotificationService,private transfer: FileTransfer, 
    private file: File, 
    public authenticationService: AuthenticationService) { 
      
    const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';
    }

  ngOnInit() {
    this.myBills();
  }
  myBills() {
    this.mybills = [];
    this.page = 1;
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let param = { 'page': this.page };
        this.curdService.getData('myBills', param)
          .subscribe((data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
              this.mybills = [];
            } else {
              this.mybills = data;
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


  doRefresh(event) {
    setTimeout(() => {
      this.mybills();
      event.target.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param:any = { 'page': this.page };
      let apiMethod = 'myBills';
      this.curdService.getData(apiMethod, param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.mybills.data.push(result.data[i]);
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
  downlaodBill(zipName:string){
    if(!this.isMobile)
    return false;
this.zipFileName = this.img_base + zipName +'.zip';
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        console.log(status);
        if (status.hasPermission) {
          this.downloadFile();
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(status => {
              console.log(status);
              if(status.hasPermission) {
                this.downloadFile();
              }
            });
        }
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
      this.appProvider.showToast('Your bill has been downloaded successfully.');
      this.localNotification.sendNotification('Your bill has been downloaded successfully.');
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
