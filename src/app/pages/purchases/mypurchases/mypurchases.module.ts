import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { MypurchasesPage } from './mypurchases.page';

const routes: Routes = [
  {
    path: '',
    component: MypurchasesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MypurchasesPage]
})
export class MypurchasesPageModule {}
