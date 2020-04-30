import { MyproductsPage } from './myproducts.page';
import { Routes } from '@angular/router';
import { AuthguardService } from '../auth/guard/authguard.service';
  export const MYPRODUCTS_ROUTES:Routes = [
    { path: '', component: MyproductsPage},
    {path: 'productview', loadChildren: './productview/productview.module#ProductviewPageModule', canActivate: [AuthguardService],  data: { num: 256 } },
    {
    path: 'addnewstock',
    loadChildren: '../stockin/addnewstock/addnewstock.module#AddnewstockPageModule', canActivate: [AuthguardService],  data: { num: 111 }
    },
    {
      path: 'addnewstock/:product_id',
      loadChildren: '../stockin/addnewstock/addnewstock.module#AddnewstockPageModule', canActivate: [AuthguardService],  data: { num: 120 }
    },
    {
    path: 'scanin',
    loadChildren: '../stockin/scanin/scanin.module#ScaninPageModule', canActivate: [AuthguardService],  data: { num: 119 }
  },
  {
    path: 'stockout',
    loadChildren: '../stockout/stockout.module#StockoutPageModule', canActivate: [AuthguardService],  data: { num: 105 }
  },  
    
  ];