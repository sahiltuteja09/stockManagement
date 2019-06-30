import { Pipe } from '@angular/core';

@Pipe({
    name: 'stocktypepipe',
})
export class stockstatusPipe {

    transform(objects: any[], exponent?: number): any[] {
        if(objects) {
            return objects.filter(object => {
                let sType = isNaN(exponent) ? 1 : exponent;
                return object.stockType == sType;
            });
        }
    }

}