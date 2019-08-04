import { Component, OnInit } from '@angular/core';
import { ConfigServiceService } from 'src/config';
import { CoreAppProvider } from 'src/app/providers/app';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  configs: any;
  name: '';
  mobile: '';
  email: '';
  address: '';
  constructor(private configService: ConfigServiceService, private appProvider: CoreAppProvider) { }

  ngOnInit() {

    this.configs = this.configService.configValue;

    if(this.configs != undefined){
      if(this.configs.status){
      
        this.name = this.configs.data.name;
        this.mobile = this.configs.data.mobile;
        this.email = this.configs.data.email;
        this.address = this.configs.data.address;
    }
  }
  }
  openEmail(email) {
    this.appProvider.openURL(email);
  }

}
