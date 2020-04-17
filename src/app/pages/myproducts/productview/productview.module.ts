import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProductviewPage } from './productview.page';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { UPDATE_PRODUCTVIEW_ROUTES } from './productview-route';

// const routes: Routes = [
//   {
//     path: '',
//     component: ProductviewPage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,
    RouterModule.forChild(UPDATE_PRODUCTVIEW_ROUTES)
  ],
  declarations: [ProductviewPage]
})
export class ProductviewPageModule {}
