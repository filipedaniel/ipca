import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { DataProvidersComponent } from './components/data-providers/data-providers.component';
import { RouterModule } from '@angular/router';

import { DATAPROVIDER_ROUTES } from './data-providers-routing';
import { DataProviderDetailComponent } from './components/data-provider-detail/data-provider-detail.component';
import { DataProviderItemComponent } from './components/data-provider-item/data-provider-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RouterModule.forChild(DATAPROVIDER_ROUTES)
  ],
  declarations: [
    DataProvidersComponent,
    DataProviderDetailComponent,
    DataProviderItemComponent
  ]
})
export class DataProvidersModule { }
