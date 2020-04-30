import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SharedPipesModule } from 'src/app/services/shared.module';
import { HideHeaderDirective } from 'src/app/providers/hide-heaer-footer/hide-header.directive';
import { TextAvatarModule } from 'src/app/services/text-avatar/text-avatar.module';
import { AuthguardService } from '../auth/guard/authguard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,SharedPipesModule,TextAvatarModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      { path: 'newsfeed', loadChildren: './newsfeed/newsfeed.module#NewsfeedPageModule', canActivate: [AuthguardService],  data: { num: 500 } },
    ])
  ],
  declarations: [HomePage,HideHeaderDirective],
  schemas: [
     NO_ERRORS_SCHEMA
  ],
  providers: [
    HideHeaderDirective
  ]
})
export class HomePageModule {}
