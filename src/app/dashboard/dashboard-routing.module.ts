import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'profiler', pathMatch: 'full' },
  { path: 'profiler', component: DashboardComponent },
  { path: 'timeline', component: DashboardComponent},
  { path: 'benchmarker', component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
