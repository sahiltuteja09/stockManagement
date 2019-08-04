import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RequestbyotherquotesPage } from './requestbyotherquotes.page';

const routes: Routes = [
  {
    path: '',
    component: RequestbyotherquotesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RequestbyotherquotesPage]
})
export class RequestbyotherquotesPageModule {}
