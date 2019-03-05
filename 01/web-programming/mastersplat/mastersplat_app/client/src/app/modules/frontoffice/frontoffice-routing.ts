import { Routes } from '@angular/router';
import { FrontofficeComponent } from './components/frontoffice/frontoffice.component';
import { FrontofficePublicationComponent } from './components/frontoffice-publication/frontoffice-publication.component';

export const FRONTOFFICE_ROUTES: Routes = [
  { 
    path: '', 
    component: FrontofficeComponent, 
    pathMatch: 'full' 
  },
  {
    path: 'publications/:id',
    component: FrontofficePublicationComponent
  }
];
