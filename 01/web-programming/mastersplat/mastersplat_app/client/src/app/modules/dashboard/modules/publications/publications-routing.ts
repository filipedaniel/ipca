import { Routes } from '@angular/router';
import { PublicationsComponent } from './components/publications/publications.component';
import { PublicationsDetailComponent } from './components/publications-detail/publications-detail.component';

export const PUBLICATIONS_ROUTES: Routes = [
  { path: '', component: PublicationsComponent },
  { path: ':id', component: PublicationsDetailComponent },
];
