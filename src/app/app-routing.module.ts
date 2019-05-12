import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
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
  { path: 'request-quote', loadChildren: './pages/quotes/request-quote/request-quote.module#RequestQuotePageModule' },
  { path: 'myquotes', loadChildren: './pages/quotes/myquotes/myquotes.module#MyquotesPageModule' },
  { path: 'messages', loadChildren: './pages/notifications/messages/messages.module#MessagesPageModule' },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
