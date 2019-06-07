import { CurdService } from './app/services/rest/curd.service';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CoreConfigConstant } from './configconstants';
@Injectable({
    providedIn: 'root'
})
export class ConfigServiceService {
    configurations: any;
    error = '';
    constructor(
        private curdService: CurdService) { }

    getConfigs(): Promise<Object> {
        let param = {'app_id':CoreConfigConstant.appID};
        return of(this.curdService.getData('appConfig', param)
            .subscribe((data: any) => {
                if(data.status){
                    this.configurations = data;
                }
                
            },
                error => {
                    this.error = error;
                },
                () => {
                }
            ))
            .toPromise();
    }
}

export function loadConfigurations(configService: ConfigServiceService) {
    return () => configService.getConfigs();
}