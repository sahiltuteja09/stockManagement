import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './pages/auth/guard/authguard.service';
import { MYPRODUCTS_ROUTES } from './pages/myproducts/myproducts-route';

const routes: Routes = [
  //{path: '**', redirectTo: 'home'},
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', canActivate: [AuthguardService],
    data: { num: 101 }
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthguardService],
    data: { num: 101 }
  },
  // {
  //   path: 'stockin',
  //   loadChildren: './pages/stockin/stockin.module#StockinPageModule', canActivate: [AuthguardService], data: { num: 104 }
  // },
  // {
  //   path: 'addnewstock',
  //   loadChildren: './pages/stockin/addnewstock/addnewstock.module#AddnewstockPageModule', canActivate: [AuthguardService],  data: { num: 111 }
  // },
  // {
  //   path: 'addnewstock/:product_id',
  //   loadChildren: './pages/stockin/addnewstock/addnewstock.module#AddnewstockPageModule', canActivate: [AuthguardService],  data: { num: 120 }
  // },
  // {
  //   path: 'scanin',
  //   loadChildren: './pages/stockin/scanin/scanin.module#ScaninPageModule', canActivate: [AuthguardService],  data: { num: 119 }
  // },
  // {
  //   path: 'stockout',
  //   loadChildren: './pages/stockout/stockout.module#StockoutPageModule', canActivate: [AuthguardService],  data: { num: 105 }
  // },  
 

  { path: 'sale', loadChildren: './pages/reports/sale/sale.module#SalePageModule', canActivate: [AuthguardService],  data: { num: 106 } },
  // { path: 'product-report/:product_id', loadChildren: './pages/reports/sale/product-report/product-report.module#ProductReportPageModule', canActivate: [AuthguardService],  data: { num: 116 } },
  //{ path: 'request-quote/:id/:user_id', loadChildren: './pages/quotes/request-quote/request-quote.module#RequestQuotePageModule', canActivate: [AuthguardService],  data: { num: 51 } },
  { path: 'myquotes', loadChildren: './pages/quotes/myquotes/myquotes.module#MyquotesPageModule', canActivate: [AuthguardService],data: { num: 107 } },
  { path: 'messages', loadChildren: './pages/notifications/messages/messages.module#MessagesPageModule' , canActivate: [AuthguardService],  data: { num: 114 }},
  { path: 'chats/:conversationId', loadChildren: './pages/notifications/chats/chats.module#ChatsPageModule', canActivate: [AuthguardService],  data: { num: 115 } },
  // { path: 'requestbymequotes', loadChildren: './pages/quotes/requestbymequotes/requestbymequotes.module#RequestbymequotesPageModule' , canActivate: [AuthguardService],  data: { num: 117 }},
  // { path: 'requestbyotherquotes', loadChildren: './pages/quotes/requestbyotherquotes/requestbyotherquotes.module#RequestbyotherquotesPageModule', canActivate: [AuthguardService],  data: { num: 118 } },
  // // { path: 'myproducts', loadChildren: './pages/myproducts/myproducts.module#MyproductsPageModule', canActivate: [AuthguardService], data: { num: 102 } },
  {path: 'myproducts', loadChildren: './pages/myproducts/myproducts.module#MyproductsPageModule'},
 //{path: 'myproducts', children: MYPRODUCTS_ROUTES},
 { path: 'mypurchases', loadChildren: './pages/purchases/mypurchases/mypurchases.module#MypurchasesPageModule', canActivate: [AuthguardService], data: { num: 103 } },
  // { path: 'khata', loadChildren: './pages/khata/khata.module#KhataPageModule', canActivate: [AuthguardService],  data: { num: 250 }  },
  { path: 'mykhatas', loadChildren: './pages/khata/mykhatas/mykhatas.module#MykhatasPageModule', canActivate: [AuthguardService],  data: { num: 251 }  },
  // { path: 'khataview', loadChildren: './pages/khata/khataview/khataview.module#KhataviewPageModule', canActivate: [AuthguardService],  data: { num: 252 }  },
  // { path: 'addcustomer', loadChildren: './pages/khata/addcustomer/addcustomer.module#AddcustomerPageModule', canActivate: [AuthguardService],  data: { num: 253 }  },
  // { path: 'addkhata', loadChildren: './pages/khata/addkhata/addkhata.module#AddkhataPageModule', canActivate: [AuthguardService],  data: { num: 254 }  },
  //{ path: 'purchasesview', loadChildren: './pages/purchases/purchasesview/purchasesview.module#PurchasesviewPageModule', canActivate: [AuthguardService],  data: { num: 255 }  },
  // { path: 'purchases', loadChildren: './purchases.module#PurchasesPageModule', canActivate: [AuthguardService],  data: { num: 112 } },
  // { path: 'purchases/:purchase_id', loadChildren: './purchases.module#PurchasesPageModule', canActivate: [AuthguardService],  data: { num: 113 } },
  // { path: 'productview', loadChildren: './pages/myproducts/productview/productview.module#ProductviewPageModule', canActivate: [AuthguardService],  data: { num: 256 }  },
 // { path: 'mybills', loadChildren: './pages/purchases/mybills/mybills.module#MybillsPageModule', canActivate: [AuthguardService],  data: { num: 257 } },
 
  // { path: 'addvendor', loadChildren: './pages/purchases/addvendor/addvendor.module#AddvendorPageModule', canActivate: [AuthguardService],  data: { num: 301 } },
  // { path: 'myvendors', loadChildren: './pages/purchases/my-vendors/my-vendors.module#MyVendorsPageModule', canActivate: [AuthguardService],  data: { num: 302 } },
  // { path: 'newsfeed', loadChildren: './pages/home/newsfeed/newsfeed.module#NewsfeedPageModule' },
  
  { path: 'image-modal', loadChildren: './pages/image-modal/image-modal.module#ImageModalPageModule',  data: { num: 201 } },
  { path: 'no-internet', loadChildren: './pages/no-internet/no-internet.module#NoInternetPageModule',  data: { num: 200 } },

  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule',  data: { num: 2 } },
  { path: 'forgot', loadChildren: './pages/auth/forgot/forgot.module#ForgotPageModule' },
  { path: 'change-password', loadChildren: './pages/setting/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthguardService],  data: { num: 300 } },
  { path: 'profile', loadChildren: './pages/setting/profile/profile.module#ProfilePageModule', canActivate: [AuthguardService] ,  data: { num: 108 }},
  { path: 'about', loadChildren: './pages/setting/about/about.module#AboutPageModule', canActivate: [AuthguardService],  data: { num: 109 } },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
