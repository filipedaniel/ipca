import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsComponent } from './components/statistics/statistics.component';

import { RouterModule } from '@angular/router';
import { STATISTICS_ROUTES } from './statistics-routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(STATISTICS_ROUTES)
  ],
  declarations: [StatisticsComponent]
})
export class StatisticsModule { }
