import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrontofficeComponent } from './components/frontoffice/frontoffice.component';
import { RouterModule } from '@angular/router';
import { FRONTOFFICE_ROUTES } from './frontoffice-routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FrontofficePublicationComponent } from './components/frontoffice-publication/frontoffice-publication.component';
import { FrontofficePublicationItemComponent } from './components/frontoffice-publication-item/frontoffice-publication-item.component';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    RouterModule.forChild(FRONTOFFICE_ROUTES),
    SharedModule,
    InfiniteScrollModule
  ],
  declarations: [
    FrontofficeComponent,
    FrontofficePublicationComponent,
    FrontofficePublicationItemComponent
  ]
})
export class FrontofficeModule { }
