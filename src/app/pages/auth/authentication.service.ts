import { Injectable } from '@angular/core';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreAppProvider } from 'src/app/providers/app';
import { User } from './model/user';
import { BehaviorSubject, Observable } from 'rxjs';

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

  isLoggedin(redirect?: string) {
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
        this.curdService.postData('login', loginData)
          .subscribe((user: any) => {

            setTimeout(() => {
              this.appProvider.dismissLoading();
            }, 2000);
            return this.saveUser(user);
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


            setTimeout(() => {
              this.appProvider.dismissLoading();
            }, 2000);
            return this.saveUser(user);
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
    }
    return user;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
