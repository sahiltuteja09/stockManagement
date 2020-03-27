import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { CoreAppProvider } from 'src/app/providers/app';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocalnotificationService } from 'src/app/services/notification/localnotification.service';
@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  
  @ViewChild('slider', { read: ElementRef })slider: ElementRef;
  img: any;
  isMobile:boolean = false;
  downloadPath:string = '';
  isAndroid: boolean = false;

  sliderOpts = {
    zoom: {
      maxRatio: 5
    }
  };
  downloadFolder:string = 'Download';
  constructor(
    private navParams: NavParams,
     private modalController: ModalController,
     private appProvider: CoreAppProvider, 
     private transfer: FileTransfer, 
     private file: File,
     private androidPermissions: AndroidPermissions,
     private localNotification: LocalnotificationService
     ) { }

  ngOnInit() {
    this.isMobile = this.appProvider.isMobile();
    this.isAndroid = this.appProvider.isAndroid();
    if(this.isMobile){
    if(this.isAndroid){
      this.downloadPath = this.file.externalRootDirectory;
    }else{
      this.downloadPath = this.file.documentsDirectory;
    }
  }
    this.img = this.navParams.get('img');
  }
  zoom(zoomIn: boolean) {
    let zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }
 

download() {
  
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
  let imageURL = this.img;
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
 
  close() {
    this.modalController.dismiss();
  }
  ionViewWillLeave() {
    this.appProvider.dismissLoading();
  }


}
