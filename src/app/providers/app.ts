import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable()
export class CoreAppProvider {
    constructor(
        private router: Router) { }

    goto(page: string, parameter?: any) {
        this.router.navigate([page]);
    }
}