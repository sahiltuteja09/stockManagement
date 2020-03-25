import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../pages/auth/authentication.service';
import { CoreConfigConstant } from '../../../configconstants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        var uploadRequest = request.url.indexOf("uploadProductDesktopImg");
        if (currentUser && currentUser.token) {
        if(uploadRequest > 0){
            request = request.clone({
                setHeaders: {
                    Authorization: `${currentUser.token}`,
                    'appid': `${CoreConfigConstant.appID}`
                }
            });
        }else{
            request = request.clone({
                setHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `${currentUser.token}`,
                    'appid': `${CoreConfigConstant.appID}`
                }
            });
        }
        }else{
            request = request.clone({
                setHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `${CoreConfigConstant.token}`,
                    'appid': `${CoreConfigConstant.appID}`
                }
            });
        }

        return next.handle(request);
    }
}