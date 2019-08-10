import { NgModule } from '@angular/core';
import { stockstatusPipe } from '../services/pipes/stockstatusFilter';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [ 
        stockstatusPipe, TimeAgoPipe
    ],
    exports: [
        stockstatusPipe, TimeAgoPipe
    ]
  })
  export class SharedPipesModule {} 