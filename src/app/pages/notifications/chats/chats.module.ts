import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatsPage } from './chats.page';
import { SharedPipesModule } from 'src/app/services/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ChatsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChatsPage]
})
export class ChatsPageModule {}
