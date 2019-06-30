import { NgModule } from '@angular/core';
import { stockstatusPipe } from '../services/pipes/stockstatusFilter';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [ 
        stockstatusPipe
    ],
    exports: [
        stockstatusPipe
    ]
  })
  export class SharedPipesModule {} 