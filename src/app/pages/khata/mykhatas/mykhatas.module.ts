import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MykhatasPage } from './mykhatas.page';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { TextAvatarModule } from 'src/app/services/text-avatar/text-avatar.module';
import { AuthguardService } from '../../auth/guard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: MykhatasPage
  },
  
  { path: 'khata', loadChildren: '../khata.module#KhataPageModule', canActivate: [AuthguardService],  data: { num: 250 }  },
  { path: 'addcustomer', loadChildren: '../addcustomer/addcustomer.module#AddcustomerPageModule', canActivate: [AuthguardService],  data: { num: 253 }  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,TextAvatarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MykhatasPage]
})
export class MykhatasPageModule {}
