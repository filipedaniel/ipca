import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  { 
    path: 'data-providers', 
    loadChildren: 'app/modules/dashboard/modules/data-providers/data-providers.module#DataProvidersModule'
  },
  { 
    path: 'publications', 
    loadChildren: 'app/modules/dashboard/modules/publications/publications.module#PublicationsModule'
  },
  {
    path: 'logs',
    loadChildren: 'app/modules/dashboard/modules/logs/logs.module#LogsModule'
  },
  { 
    path: '', 
    loadChildren: 'app/modules/dashboard/modules/statistics/statistics.module#StatisticsModule', 
    pathMatch: 'full' 
  },
];
