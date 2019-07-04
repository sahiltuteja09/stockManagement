import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './pages/auth/guard/authguard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', canActivate: [AuthguardService]
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthguardService]
  },
  {
    path: 'stockin',
    loadChildren: './pages/stockin/stockin.module#StockinPageModule'
  },
  {
    path: 'addnewstock',
    loadChildren: './pages/stockin/addnewstock/addnewstock.module#AddnewstockPageModule'
  },
  {
    path: 'scanin',
    loadChildren: './pages/stockin/scanin/scanin.module#ScaninPageModule'
  },
  {
    path: 'stockout',
    loadChildren: './pages/stockout/stockout.module#StockoutPageModule'
  },  
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/setting/profile/profile.module#ProfilePageModule' },
  { path: 'about', loadChildren: './pages/setting/about/about.module#AboutPageModule' },
  { path: 'sale', loadChildren: './pages/reports/sale/sale.module#SalePageModule' },
  { path: 'request-quote/:id/:user_id', loadChildren: './pages/quotes/request-quote/request-quote.module#RequestQuotePageModule' },
  { path: 'myquotes', loadChildren: './pages/quotes/myquotes/myquotes.module#MyquotesPageModule' },
  { path: 'messages', loadChildren: './pages/notifications/messages/messages.module#MessagesPageModule' },
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'forgot', loadChildren: './pages/auth/forgot/forgot.module#ForgotPageModule' },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
