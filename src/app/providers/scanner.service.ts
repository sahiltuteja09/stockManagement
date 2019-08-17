import { Injectable } from '@angular/core';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  // public scannerPermission: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // public isScaning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // public scanedText: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public barCodeText: BehaviorSubject<any> = new BehaviorSubject<any>({'status': false, 'msg': ''});
  constructor(private barcodeScanner: BarcodeScanner) {
    //private qrScanner: QRScanner
   }


  setScaningFlag() {
    // this.isScaning.next(false);
    // this.scanedText.next('');
  }
  scanCode() {
    // Optionally request the permission early
    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //     if (status.authorized) {
    //       this.scannerPermission.next(true);
    //       this.isScaning.next(true);
    //       this.qrScanner.show();
    //       (window.document.querySelector('.cameraClass') as HTMLElement).classList.add('cameraView');
    //       // start scanning
    //       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //         this.hideCamera(true);
    //         this.isScaning.next(false);
    //         this.scanedText.next(text);
    //         scanSub.unsubscribe(); // stop scanning
    //       });

    //     } else if (status.denied) {
    //       console.log('scanpermission 1');
    //       this.scannerPermission.next(false);
    //       // this.appProvider.showToast('Status denied');
    //       // camera permission was permanently denied
    //       // you must use QRScanner.openSettings() method to guide the user to the settings page
    //       // then they can grant the permission from there
    //     } else {
    //       console.log('scanpermission 2');
    //       // permission was denied, but not permanently. You can ask for permission again at a later time.
    //       this.scannerPermission.next(false);
    //     }
    //   })
    //   .catch((e: any) => {
    //     console.log('scanpermission 3');
    //     console.log(e);
    //     if (e.name == "CAMERA_ACCESS_DENIED") {
    //       this.scannerPermission.next(false);
    //     }
    //   });
  }

  hideCamera(isFlashEnable) {
    // if (isFlashEnable) {
    //   this.qrScanner.disableLight();
    // }
    // (window.document.querySelector('.cameraClass') as HTMLElement).classList.remove('cameraView');
    // this.qrScanner.hide();
    // this.distroyScaner();
    // return 'flash';
  }
  openFlash(isFlashEnable) {
    // let icon = 'flash';
    // if (isFlashEnable) {
    //   icon = 'flash-off';
    //   this.qrScanner.enableLight();
    // } else {
    //   icon = 'flash';
    //   this.qrScanner.disableLight();
    // }
    // return icon;
  }
  openSetting() {
   // this.qrScanner.openSettings();
  }
  distroyScaner() {
   // this.qrScanner.destroy();
  }

  scanBarCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if(!barcodeData.cancelled)
      this.barCodeText.next({'status': true, 'msg': barcodeData.text});
    }).catch(err => {
      console.log('Error', err);
      this.barCodeText.next({'status': false,'msg': 'Unable to scan the code try again.'});
    });
  }
  emptyText(){
    this.barCodeText.next({'status': false, 'msg': ''});
  }

}
