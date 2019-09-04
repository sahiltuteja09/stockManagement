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
    loadChildren: './pages/stockin/stockin.module#StockinPageModule', canActivate: [AuthguardService]
  },
  {
    path: 'addnewstock',
    loadChildren: './pages/stockin/addnewstock/addnewstock.module#AddnewstockPageModule', canActivate: [AuthguardService]
  },
  {
    path: 'addnewstock/:product_id',
    loadChildren: './pages/stockin/addnewstock/addnewstock.module#AddnewstockPageModule', canActivate: [AuthguardService]
  },
  {
    path: 'scanin',
    loadChildren: './pages/stockin/scanin/scanin.module#ScaninPageModule', canActivate: [AuthguardService]
  },
  {
    path: 'stockout',
    loadChildren: './pages/stockout/stockout.module#StockoutPageModule', canActivate: [AuthguardService]
  },  
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'forgot', loadChildren: './pages/auth/forgot/forgot.module#ForgotPageModule' },
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/setting/profile/profile.module#ProfilePageModule', canActivate: [AuthguardService] },
  { path: 'about', loadChildren: './pages/setting/about/about.module#AboutPageModule', canActivate: [AuthguardService] },
  { path: 'sale', loadChildren: './pages/reports/sale/sale.module#SalePageModule', canActivate: [AuthguardService] },
  { path: 'request-quote/:id/:user_id', loadChildren: './pages/quotes/request-quote/request-quote.module#RequestQuotePageModule', canActivate: [AuthguardService] },
  { path: 'myquotes', loadChildren: './pages/quotes/myquotes/myquotes.module#MyquotesPageModule', canActivate: [AuthguardService] },
  { path: 'messages', loadChildren: './pages/notifications/messages/messages.module#MessagesPageModule' , canActivate: [AuthguardService]},
  { path: 'chats/:conversationId', loadChildren: './pages/notifications/chats/chats.module#ChatsPageModule', canActivate: [AuthguardService] },
  { path: 'product-report/:product_id', loadChildren: './pages/reports/sale/product-report/product-report.module#ProductReportPageModule', canActivate: [AuthguardService] },
  { path: 'requestbymequotes', loadChildren: './pages/quotes/requestbymequotes/requestbymequotes.module#RequestbymequotesPageModule' , canActivate: [AuthguardService]},
  { path: 'requestbyotherquotes', loadChildren: './pages/quotes/requestbyotherquotes/requestbyotherquotes.module#RequestbyotherquotesPageModule', canActivate: [AuthguardService] },
  { path: 'myproducts', loadChildren: './pages/myproducts/myproducts.module#MyproductsPageModule', canActivate: [AuthguardService] },
  { path: 'no-internet', loadChildren: './pages/no-internet/no-internet.module#NoInternetPageModule' },
  { path: 'purchases', loadChildren: './pages/purchases/purchases.module#PurchasesPageModule' },
  { path: 'purchases/:purchase_id', loadChildren: './pages/purchases/purchases.module#PurchasesPageModule' },  { path: 'mypurchases', loadChildren: './pages/purchases/mypurchases/mypurchases.module#MypurchasesPageModule' },
  { path: 'image-modal', loadChildren: './pages/image-modal/image-modal.module#ImageModalPageModule' },


  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
