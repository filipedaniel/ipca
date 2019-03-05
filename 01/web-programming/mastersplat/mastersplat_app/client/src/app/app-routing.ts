import { Routes } from '@angular/router';

import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { DashboardComponent, DASHBOARD_ROUTES } from "./modules/dashboard/";
import { FrontofficeComponent } from './modules/frontoffice/components/frontoffice/frontoffice.component';
import { FRONTOFFICE_ROUTES } from './modules/frontoffice/frontoffice-routing';


export const AppRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, children: DASHBOARD_ROUTES },
  { path: '', component: FrontofficeComponent, children: FRONTOFFICE_ROUTES },
  { path: '**', component: PagenotfoundComponent }
];
