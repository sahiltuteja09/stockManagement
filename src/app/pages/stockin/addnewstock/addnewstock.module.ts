import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddnewstockPage } from './addnewstock.page';
import { UPDATE_ADDNEWSTOCK_ROUTES } from './addnewstock-route';

// const routes: Routes = [
//   {
//     path: '',
//     component: AddnewstockPage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(UPDATE_ADDNEWSTOCK_ROUTES)
  ],
  declarations: [AddnewstockPage]
})
export class AddnewstockPageModule {}
