import { Injectable } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  public scannerPermission: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isScaning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public scanedText: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private qrScanner: QRScanner) { }


setScaningFlag(){
  this.isScaning.next(false);
  this.scanedText.next('');
}
  scanCode() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.scannerPermission.next(true);
          this.isScaning.next(true);
          this.qrScanner.show();
          (window.document.querySelector('.cameraClass') as HTMLElement).classList.add('cameraView');
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.hideCamera(true);
            this.scanedText.next(text);
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          this.scannerPermission.next(false);
          // this.appProvider.showToast('Status denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          this.scannerPermission.next(false);
        }
      })
      .catch((e: any) => {
        if (e.name == "CAMERA_ACCESS_DENIED") {
          this.scannerPermission.next(false);
        }
      });
  }

  hideCamera(isFlashEnable) {
    if (isFlashEnable) {
      this.qrScanner.disableLight();
    }
    (window.document.querySelector('.cameraClass') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();
    return 'flash';
  }
  openFlash(isFlashEnable) {
    let icon = 'flash';
    if (isFlashEnable) {
      icon = 'flash-off';
      this.qrScanner.enableLight();
    } else {
      icon = 'flash';
      this.qrScanner.disableLight();
    }
    return icon;
  }
  openSetting() {
    this.qrScanner.openSettings();
  }
  distroyScaner() {
    this.qrScanner.destroy();
  }
}
