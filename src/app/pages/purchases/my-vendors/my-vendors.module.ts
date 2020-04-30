import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyVendorsPage } from './my-vendors.page';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { TextAvatarModule } from 'src/app/services/text-avatar/text-avatar.module';
import { AuthguardService } from '../../auth/guard/authguard.service';
const routes: Routes = [
  {
    path: '',
    component: MyVendorsPage
  },
  { path: 'addvendor', loadChildren: '../addvendor/addvendor.module#AddvendorPageModule', canActivate: [AuthguardService],  data: { num: 301 } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,TextAvatarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyVendorsPage]
})
export class MyVendorsPageModule {}
