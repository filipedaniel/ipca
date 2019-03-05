import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutes } from './app-routing';
import { RouterModule } from '@angular/router';

import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';

import { HttpClientModule } from '@angular/common/http';
import { FrontofficeModule } from './modules/frontoffice/frontoffice.module';
//import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      AppRoutes, { useHash : true }
    ),
    BrowserAnimationsModule,
    DashboardModule,
    FrontofficeModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
