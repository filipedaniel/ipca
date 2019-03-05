import { Routes } from "@angular/router";
import { LogsComponent } from "./components/logs/logs.component";
import { LogDetailComponent } from "./components/log-detail/log-detail.component";


export const LOGS_ROUTES: Routes = [
  { path: '', component: LogsComponent },
  { path: ':id', component: LogDetailComponent }
];

