import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilerComponent } from './profiler/profiler.component';
import { WhatsNextComponent } from './whats-next/whats-next.component';
import { WhatsHappeningComponent } from './whats-happening/whats-happening.component';
import { WhyIsHappeningComponent } from './why-is-happening/why-is-happening.component';
import { InnovationContributionComponent } from './innovation-contribution/innovation-contribution.component';
import { MarketShareComponent } from './market-share/market-share.component';
import { ItemPerformaceComponent } from './item-performace/item-performace.component';
import { InnovationTypeComponent } from './innovation-type/innovation-type.component';
import { ItemsLandingComponent } from './items/items-landing/items-landing.component';
import { OutletWrapperComponent } from '../shared/components/outlet-wrapper/outlet-wrapper.component';
import { ActivityIntensityComponent } from './activity-intensity/activity-intensity.component';
import { LxSubTypesComponent } from './lx-sub-types/lx-sub-types.component';
import { InnovationCharacteristicsComponent } from './innovation-characteristics/innovation-characteristics.component';

const routes: Routes = [
  {
    path: '', component: ProfilerComponent,
    children: [
      { path: '', redirectTo: 'whats-happening', pathMatch: 'full' },
      {
        path: 'whats-happening', component: WhatsHappeningComponent,
        children: [
          { path: '', redirectTo: 'innovation-contribution', pathMatch: 'full' },
          {
            path: 'innovation-contribution', component: OutletWrapperComponent,
            children: [
              { path: '', component: InnovationContributionComponent },
              { path: ':id/items', component: ItemsLandingComponent },
            ]
          },
          {
            path: 'market-share', component: OutletWrapperComponent,
            children: [
              { path: '', component: MarketShareComponent },
              { path: ':id/items', component: ItemsLandingComponent },
            ]
          },
        ]
      },
      {
        path: 'why', component: WhyIsHappeningComponent,
        children: [
          { path: '', redirectTo: 'activity-intensity', pathMatch: 'full' },
          {
            path: 'activity-intensity', component: OutletWrapperComponent,
            children: [
              { path: '', component: ActivityIntensityComponent },
              { path: ':id/items', component: ItemsLandingComponent },
            ]
          },
          {
            path: 'item-performance', component: OutletWrapperComponent,
            children: [
              { path: '', component: ItemPerformaceComponent },
              { path: ':id/items', component: ItemsLandingComponent },
            ]
          },
          {
            path: 'innovation-type', component: OutletWrapperComponent,
            children: [
              { path: '', component: InnovationTypeComponent },
              { path: ':id/items', component: ItemsLandingComponent },
            ]
          },
          {
            path: 'lx-sub-types', component: OutletWrapperComponent,
            children: [
              { path: '', component: LxSubTypesComponent },
              { path: ':id/items', component: ItemsLandingComponent },
            ]
          },
        ]
      },
      {
        path: 'whats-next', component: WhatsNextComponent,
        children: [
          { path: '', component: InnovationCharacteristicsComponent },
          { path: ':id/items', component: ItemsLandingComponent },
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilerRoutingModule { }
