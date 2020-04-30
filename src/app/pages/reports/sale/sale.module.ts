import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SalePage } from './sale.page';
import { AuthguardService } from '../../auth/guard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: SalePage
  },
  { path: 'product-report/:product_id', loadChildren: '../sale/product-report/product-report.module#ProductReportPageModule', canActivate: [AuthguardService],  data: { num: 116 } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SalePage]
})
export class SalePageModule {}
