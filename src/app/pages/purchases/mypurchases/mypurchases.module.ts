import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { MypurchasesPage } from './mypurchases.page';
import { AuthguardService } from '../../auth/guard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: MypurchasesPage
  }, 
  { path: 'purchases', loadChildren: '../purchases.module#PurchasesPageModule', canActivate: [AuthguardService],  data: { num: 112 } },
  { path: 'purchases/:purchase_id', loadChildren: '../purchases.module#PurchasesPageModule', canActivate: [AuthguardService],  data: { num: 113 } },
  { path: 'purchasesview', loadChildren: '../purchasesview/purchasesview.module#PurchasesviewPageModule', canActivate: [AuthguardService],  data: { num: 255 }  },
  { path: 'mybills', loadChildren: '../mybills/mybills.module#MybillsPageModule', canActivate: [AuthguardService],  data: { num: 257 } },
  
  { path: 'myvendors', loadChildren: '..//my-vendors/my-vendors.module#MyVendorsPageModule', canActivate: [AuthguardService],  data: { num: 302 } },
  
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
