import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyquotesPage } from './myquotes.page';
import { AuthguardService } from '../../auth/guard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: MyquotesPage
  },
  { path: 'requestbymequotes', loadChildren: '../requestbymequotes/requestbymequotes.module#RequestbymequotesPageModule' , canActivate: [AuthguardService],  data: { num: 117 }},
  { path: 'requestbyotherquotes', loadChildren: '../requestbyotherquotes/requestbyotherquotes.module#RequestbyotherquotesPageModule', canActivate: [AuthguardService],  data: { num: 118 } },
  { path: 'request-quote/:id/:user_id', loadChildren: '../request-quote/request-quote.module#RequestQuotePageModule', canActivate: [AuthguardService],  data: { num: 51 } },
  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyquotesPage]
})
export class MyquotesPageModule {}
