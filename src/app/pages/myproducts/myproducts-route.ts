import { MyproductsPage } from './myproducts.page';
import { AuthguardService } from '../auth/guard/authguard.service';

export const MYPRODUCTS_ROUTES = [
    { path: '', component: MyproductsPage },
    { path: 'productview', loadChildren: './pages/myproducts/productview/productview.module#ProductviewPageModule', canActivate: [AuthguardService],  data: { num: 256 }  },
  ];