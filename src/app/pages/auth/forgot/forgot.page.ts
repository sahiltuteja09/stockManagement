import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfigConstant } from '../../../../configconstants';
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  public forgotDetails: FormGroup;
  submitAttempt: boolean = false;
  appId: string;
  constructor(public formBuilder: FormBuilder) {
    this.appId = CoreConfigConstant.appID;
    this.forgotDetails = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      appid: [this.appId]
    });
  }

  ngOnInit() {
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
    }
  }

}
