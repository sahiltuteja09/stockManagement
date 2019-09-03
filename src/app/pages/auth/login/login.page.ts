import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfigConstant } from '../../../../configconstants';
import { AuthenticationService } from '../authentication.service';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginDetails: FormGroup;
  submitAttempt: boolean = false;
  appId: string;
  constructor(public formBuilder: FormBuilder, private authenticationService: AuthenticationService,  menu: MenuController) {
    //this.appId = CoreConfigConstant.appID;
    this.loginDetails = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      appid: [CoreConfigConstant.appID]
    });
  }

  ngOnInit() {
    
  }
  ionViewDidEnter(){
    this.loginDetails.controls["email"].setValue('');
    this.loginDetails.controls["password"].setValue('');
// check login
this.authenticationService.isLoggedin('home');
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginDetails.controls; }

  login() {
    // stop here if form is invalid
    if (this.loginDetails.invalid) {
      return;
    }
    this.submitAttempt = true;
    if (!this.loginDetails.valid) { 
      console.log('form'); 
    } else {
      this.authenticationService.login(this.loginDetails.value);
     
      //this.f.email.value, this.f.password.value
    }
  }

  ionViewWillLeave(){

  }

}
