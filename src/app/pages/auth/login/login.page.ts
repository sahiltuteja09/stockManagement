import { Component, OnInit, HostListener } from '@angular/core';
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
//   form: HTMLFormElement;

// @HostListener('keydown.enter')
// handleEnterKey(e: KeyboardEvent) {
//   if ((e.target as HTMLIonInputElement).name === 'password') {
//     (this.form
//       .querySelector('ion-button[type="submit"]')
//       .shadowRoot.querySelector('button[type="submit"]') as HTMLButtonElement).click();
//   }
// }

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

  submitForm(e:Event){
    e.preventDefault();
    e.stopPropagation();
    this.login();
  }

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
