import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../../classes/validator/email';
import { CoreConfigConstant } from '../../../../configconstants';
import { AuthenticationService } from '../authentication.service';
//https://www.joshmorony.com/advanced-forms-validation-in-ionic-2/
//https://jasonwatmore.com/post/2018/05/10/angular-6-reactive-forms-validation-example
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerDetails: FormGroup;
  submitAttempt: boolean = false;
  appId: string;
  constructor(
    public formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService
     ) {
    this.appId = CoreConfigConstant.appID;
    this.registerDetails = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      mobile: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      appid: [this.appId]
    });
  }
  // get the form contorls in a f object
  get f() { return this.registerDetails.controls; }
  ngOnInit() {
  }
  ionViewDidEnter(){
    // check login
    this.authenticationService.isLoggedin('home');
      }
  register() {
    this.submitAttempt = true;
    if (!this.registerDetails.valid) {
       console.log('form'); 
      }
    else {
      this.authenticationService.register(this.registerDetails.value);
      console.log(this.registerDetails.value);
    }

  }
}
