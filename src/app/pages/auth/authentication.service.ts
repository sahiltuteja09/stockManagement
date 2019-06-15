import { Injectable } from '@angular/core';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreAppProvider } from 'src/app/providers/app';
import { User } from './model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { CoreConfigConstant } from '../../../configconstants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  isLoggedin(redirect?: string, removeHistory?:number) {
    if (this.currentUserValue) {
      if (redirect) {
        this.appProvider.goto(redirect);
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(loginData: any) {
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        loginData.deviceId = this.appProvider.deviceId;
        loginData.platform = this.appProvider.devicePlatform;

        this.curdService.postData('login', loginData)
          .subscribe((user: any) => {
            if (user.status) {
              if (this.generateToken(loginData.appid,loginData.deviceId, user.data.id) == user.data.token) {
                 this.saveUser(user.data);
              }
            }else{
              if(user.device_limit > 0){
                // logout from all other device except the same device
                  this.curdService.postData('logoutAll', {'user_id': user.device_limit, 'deviceid': loginData.deviceId, 'appid' : loginData.appid}).subscribe((d:any) =>{});
                  this.logout();
                
              }
              this.appProvider.showToast(user.msg);
            }
            setTimeout(() => {
              this.appProvider.dismissLoading();
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

  register(registerData: any) {
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.postData('register', registerData)
          .subscribe((user: any) => {

            if (user.status) {
              this.appProvider.showToast(user.data);
              setTimeout(() => {
                this.appProvider.goto('login');
              }, 2000);
            } else {
              this.appProvider.showToast(user.msg);
              this.logout();

            }
            setTimeout(() => {
              this.appProvider.dismissLoading();
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

  saveUser(user) {
    if (user && user.token) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.appProvider.goto('home', 1);
    }
    return user;
  }
  generateToken(app_id,device_id, user_id) {
    const salt = CoreConfigConstant.salt;
    return Md5.hashStr(app_id +device_id+ user_id + salt)
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.curdService.postData('logout', {}).subscribe((d:any) =>{});

    this.currentUserSubject.next(null);
    this.appProvider.goto('login', 1);
  }
}
