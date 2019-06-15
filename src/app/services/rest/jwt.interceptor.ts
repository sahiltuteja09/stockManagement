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
        
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `${currentUser.token}`
                }
            });
        }else{
            request = request.clone({
                setHeaders: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `${CoreConfigConstant.token}`
                }
            });
        }

        return next.handle(request);
    }
}