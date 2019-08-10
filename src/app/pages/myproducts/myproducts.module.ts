import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyproductsPage } from './myproducts.page';
import { SharedPipesModule } from 'src/app/services/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MyproductsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyproductsPage]
})
export class MyproductsPageModule {}
