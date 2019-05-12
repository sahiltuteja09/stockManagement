import { CurdService } from './app/services/rest/curd.service';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class ConfigServiceService {
    configurations: any;
    error = '';
    constructor(
        private curdService: CurdService) { }

    getConfigs(): Promise<Object> {
        const dummyConfigs: Object = {
            APIEndpoint: 'url_here',
            apiKey: 'abcdee'
        };

        return of(dummyConfigs) // <== this could be a http request here
            .pipe(
                tap(config => {
                    this.configurations = config;
                })
            )
            .toPromise();
        // return of(this.curdService.getData('localhost/stockmanagement/config')
        //     .subscribe((data: any) => {
        //         this.configurations = data;
        //     },
        //         error => {
        //             this.error = error;
        //         },
        //         () => {
        //         }
        //     ))
        //     .toPromise();
    }
}

export function loadConfigurations(configService: ConfigServiceService) {
    return () => configService.getConfigs();
}