import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreConfigConstant } from '../../../../configconstants';
import { AuthenticationService } from '../authentication.service';
import { MenuController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginDetails: FormGroup;
  submitAttempt: boolean = false;
  appId: string;
  showAddToHomeBtn: boolean = true;
  deferredPrompt;
  constructor(
    public formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,  
    menu: MenuController,
    public toastController: ToastController) {
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


(<any>window).addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later on the button event.
  this.deferredPrompt = e;
   
// Update UI by showing a button to notify the user they can add to home screen
  
  if(this.showAddToHomeBtn){
    this.addToHomeTost() ;
    this.showAddToHomeBtn = false;
  }
  
 });
}
async addToHomeTost() {
  const toast = await this.toastController.create({
    showCloseButton: true,
    closeButtonText: 'Ok',
    animated:true,
    message: 'Click "ADD" to get full screen mode and faster loading..',
    position: 'bottom',
   
  });
  toast.present();

  toast.onWillDismiss().then(() => {
    this.add_to_home();
  });
}
add_to_home(){
  debugger
  // hide our user interface that shows our button
  // Show the prompt
  this.deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  this.deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the prompt');
      } else {
        this.showAddToHomeBtn = true;
        console.log('User dismissed the prompt');
      }
      this.deferredPrompt = null;
    });
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
