import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewsfeedPage } from './newsfeed.page';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { TextAvatarModule } from 'src/app/services/text-avatar/text-avatar.module';
const routes: Routes = [
  {
    path: '',
    component: NewsfeedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
    ,SharedPipesModule,TextAvatarModule,
  ],
  declarations: [NewsfeedPage]
})
export class NewsfeedPageModule {}
