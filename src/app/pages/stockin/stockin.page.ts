import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-stockin',
  templateUrl: './stockin.page.html',
  styleUrls: ['./stockin.page.scss'],
})
export class StockinPage implements OnInit {

  constructor(private qrScanner: QRScanner) { }

  ngOnInit() {
  }

 

}
