import { Routes } from '@angular/router';
import { DataProvidersComponent } from './components/data-providers/data-providers.component';
import { DataProviderDetailComponent } from './components/data-provider-detail/data-provider-detail.component';


export const DATAPROVIDER_ROUTES: Routes = [
  { path: '', component: DataProvidersComponent },
  { path: ':id', component: DataProviderDetailComponent },
];
