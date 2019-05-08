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
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
