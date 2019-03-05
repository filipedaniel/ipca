import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './components/logs/logs.component';
import { LogItemComponent } from './components/log-item/log-item.component';
import { LogDetailComponent } from './components/log-detail/log-detail.component';
import { RouterModule } from '@angular/router';
import { LOGS_ROUTES } from './logs-routing';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    CommonModule,
    PaginationModule.forRoot(),
    RouterModule.forChild(LOGS_ROUTES)
  ],
  declarations: [
    LogsComponent, 
    LogItemComponent, 
    LogDetailComponent
  ]
})
export class LogsModule { }
