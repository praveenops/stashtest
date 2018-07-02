import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './shared/components/unauthorized.component/unauthorized.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';


const routes: Routes = [
  { path: '', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
  { path: 'profiler/:contextId/new', loadChildren: 'app/profiler/profiler.module#ProfilerModule' },
  { path: 'alerts', loadChildren: 'app/alerts/alerts.module#AlertsModule' },
  { path: '404', component: PageNotFoundComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class IonAppRoutingModule { }
