import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KhataPage } from './khata.page';
import { TextAvatarModule } from 'src/app/services/text-avatar/text-avatar.module';
import { AuthguardService } from '../auth/guard/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: KhataPage
  },
  { path: 'khataview', loadChildren: './khataview/khataview.module#KhataviewPageModule', canActivate: [AuthguardService],  data: { num: 252 }  },
  { path: 'addkhata', loadChildren: './addkhata/addkhata.module#AddkhataPageModule', canActivate: [AuthguardService],  data: { num: 254 }  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,TextAvatarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KhataPage]
})
export class KhataPageModule {}
