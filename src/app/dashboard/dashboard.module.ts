import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StoreModule } from '@ngrx/store';
import { FEATURE } from '../features';
import { dashboardReducers } from './_store/dashboard-reducers';
import { IonUiComponentsModule } from 'ion-ui-components';
import { dashboardEffects } from './_store/dashboard-effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(FEATURE.DASHBOARD, dashboardReducers),
    EffectsModule.forFeature(dashboardEffects),
    DashboardRoutingModule,
    IonUiComponentsModule,
  ],
  declarations: [
    DashboardComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule { }
