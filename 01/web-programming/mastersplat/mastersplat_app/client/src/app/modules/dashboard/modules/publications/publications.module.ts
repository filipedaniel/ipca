import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicationsComponent } from './components/publications/publications.component';
import { PublicationsDetailComponent } from './components/publications-detail/publications-detail.component';
import { PUBLICATIONS_ROUTES } from './publications-routing';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(PUBLICATIONS_ROUTES),
    SharedModule
  ],
  declarations: [
    PublicationsComponent,
    PublicationsDetailComponent
  ]
})
export class PublicationsModule { }
