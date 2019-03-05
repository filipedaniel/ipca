import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicationItemComponent } from './components/publication-item/publication-item.component';
import { RouterModule } from '@angular/router';
import { TruncatePipe } from './pipes/truncate.pipe';
import { PublicationDetailComponent } from './components/publication-detail/publication-detail.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    PublicationItemComponent,
    TruncatePipe,
    PublicationDetailComponent
  ],
  exports: [
    PublicationItemComponent,
    PublicationDetailComponent
  ]
})
export class SharedModule { }
