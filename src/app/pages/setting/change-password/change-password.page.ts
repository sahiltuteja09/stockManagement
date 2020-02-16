import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { LocalnotificationService } from 'src/app/services/notification/localnotification.service';
import { AuthenticationService } from 'src/app/pages/auth/authentication.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public changePassword: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public appProvider: CoreAppProvider,
    public curdService:CurdService,
    private localNotification: LocalnotificationService,
    public authenticationService: AuthenticationService) { 
    this.changePassword = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])]
    }, {validator: this.matchingPasswords('password', 'confirm_password')}); 
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.changePassword.controls["password"].setValue('');
    this.changePassword.controls["confirm_password"].setValue('');
  }
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
   // convenience getter for easy access to form fields
   get f() { return this.changePassword.controls; }

   update(){
    {
      // stop here if form is invalid
      if (this.changePassword.invalid) {
        return;
      }
      if (!this.changePassword.valid) { 
        console.log('form'); 
      } else {
        console.log(this.changePassword.value); 

        this.appProvider.showLoading().then(loading => {
          loading.present().then(() => {
            this.curdService.postData('changePassword', {'password': this.changePassword.value.password } )
              .subscribe((data: any) => {
    
                if (data.status) {
                  this.appProvider.showToast(data.msg);
                  this.changePassword.controls["password"].setValue('');
                  this.changePassword.controls["confirm_password"].setValue('');

                  this.localNotification.cancelAllLocalNotifications();
                  setTimeout(() => {
                    this.authenticationService.logout();
                  }, 1000);
                  

                } else {
                  this.appProvider.showToast(data.msg);
                }
                this.appProvider.dismissLoading();
    
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
