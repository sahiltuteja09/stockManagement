import { NgModule } from '@angular/core';
import { stockstatusPipe } from '../services/pipes/stockstatusFilter';
import { TimeAgoPipe } from 'time-ago-pipe';
import { SafehtmlPipe } from './pipes/safehtml.pipe';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [ 
        stockstatusPipe, TimeAgoPipe, SafehtmlPipe
    ],
    exports: [
        stockstatusPipe, TimeAgoPipe, SafehtmlPipe
    ]
  })
  export class SharedPipesModule {} 