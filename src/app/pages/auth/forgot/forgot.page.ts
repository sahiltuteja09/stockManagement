import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfigConstant } from '../../../../configconstants';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  public forgotDetails: FormGroup;
  submitAttempt: boolean = false;
  appId: string;
  otpSent:boolean = false;
  constructor(public formBuilder: FormBuilder, private appProvider:CoreAppProvider, private curdService:CurdService) {
    this.appId = CoreConfigConstant.appID;
    this.forgotDetails = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      appid: [this.appId],
      otp: [''],
      password: ['']
    });
  }

  ngOnInit() {
  }
  submitForm(e:Event){
    e.preventDefault();
    e.stopPropagation();
    this.forgot();
  }
  // convenience getter for easy access to form fields
  get f() { return this.forgotDetails.controls; }
  forgot() {
    // stop here if form is invalid
    if (this.forgotDetails.invalid) {
      return;
    }
    this.submitAttempt = true;
    if (!this.forgotDetails.valid) { console.log('form'); } else {

      //this.f.email.value, this.f.password.value
      console.log(this.forgotDetails.value);

if(!this.otpSent){
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let apiMethod = 'forgotPassword';
        let email = this.forgotDetails.value.email;
        let appid = this.forgotDetails.value.appid;
        
        this.curdService.postData(apiMethod, {'email':email, 'appid':appid})
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.data);
            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {

              this.appProvider.dismissLoading();
              if (data.status)
              this.otpSent = true;
                //this.appProvider.goto('login')
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
  }else{


    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let apiMethod = 'verifyForgotPassword';
        let email = this.forgotDetails.value.email;
        let appid = this.forgotDetails.value.appid;
        let otp = this.forgotDetails.value.otp;
        let password = this.forgotDetails.value.password;
        
        this.curdService.postData(apiMethod, {'email':email, 'appid':appid, 'otp':otp, 'password':password})
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.data);
              this.forgotDetails.reset();
            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {

              this.appProvider.dismissLoading();
              if (data.status)
              this.appProvider.goto('login')
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
    }
  }

}
