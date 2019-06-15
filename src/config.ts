import { CurdService } from './app/services/rest/curd.service';
import { of, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoreConfigConstant } from './configconstants';
@Injectable({
    providedIn: 'root'
})
export class ConfigServiceService {
    configurations: any;
    error = '';
    private currentConfigSubject: BehaviorSubject<any>;
    constructor(
        private curdService: CurdService) {
            this.currentConfigSubject = new BehaviorSubject<any>(null);
         }

        public get configValue() {
            return this.currentConfigSubject.value;
          }

    getConfigs(): Promise<Object> {
        let param = {'app_id':CoreConfigConstant.appID};
        return of(this.curdService.getData('appConfig', param)
            .subscribe((data: any) => {
                this.configurations = data;
                this.currentConfigSubject.next(data);
            },
                (error) => {
                    console.log('in Error');
                    this.configurations = {'status': false, 'msg': 'Something went wrong or no internet.'};
                    this.error = error;
                    this.currentConfigSubject.next(this.configurations);
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