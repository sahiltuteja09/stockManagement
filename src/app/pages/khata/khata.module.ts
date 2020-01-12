import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KhataPage } from './khata.page';
import { TextAvatarModule } from 'src/app/services/text-avatar/text-avatar.module';

const routes: Routes = [
  {
    path: '',
    component: KhataPage
  }
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
