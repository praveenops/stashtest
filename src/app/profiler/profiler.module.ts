import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilerRoutingModule } from './profiler-routing.module';
import { ProfilerComponent } from './profiler/profiler.component';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { profilerReducers } from './_store/profiler-reducers';
import { FEATURE } from '../features';
import { WhatsHappeningComponent } from './whats-happening/whats-happening.component';
import { WhyIsHappeningComponent } from './why-is-happening/why-is-happening.component';
import { WhatsNextComponent } from './whats-next/whats-next.component';
import { MarketShareComponent } from './market-share/market-share.component';
import { InnovationContributionComponent } from './innovation-contribution/innovation-contribution.component';
import { ItemPerformaceComponent } from './item-performace/item-performace.component';
import { InnovationTypeComponent } from './innovation-type/innovation-type.component';
import { IonDataVisualizationsModule } from 'ion-ui-components';
import { IonUiComponentsModule, IonVizModule } from 'ion-ui-components';
import { TimePeriodComponent } from './time-period/time-period.component';
import { EditProfilerComponent } from './edit-profiler/edit-profiler.component';
import { profilerEffects } from './_store/profiler-effects';
import { ItemsLandingComponent } from './items/items-landing/items-landing.component';
import { ItemListComponent } from './items/item-list/item-list.component';
import { ItemDetailsComponent } from './items/item-details/item-details.component';
import { ItemPicturesComponent } from './items/item-pictures/item-pictures.component';
import { ImageComponent } from './items/image/image.component';
import { PublicImage } from '../shared/pipes/public-image.pipe';
import { InitcapsPipe } from '../shared/pipes/init-cap.pipe';
import { DateToTimestampPipe } from '../shared/pipes/date-to-timestamp.pipe';
import { ActivityIntensityComponent } from './activity-intensity/activity-intensity.component';
import { LxSubTypesComponent } from './lx-sub-types/lx-sub-types.component';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import { ProfilerContextService } from './profiler-context-service';
import { InnovationCharacteristicsComponent } from './innovation-characteristics/innovation-characteristics.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
    EffectsModule.forFeature(profilerEffects),
    ProfilerRoutingModule,
    IonDataVisualizationsModule,
    IonVizModule,
    IonUiComponentsModule,
    PerfectScrollbarModule,

  ],
  declarations: [
    ProfilerComponent,
    WhatsHappeningComponent,
    WhyIsHappeningComponent,
    WhatsNextComponent,
    MarketShareComponent,
    InnovationContributionComponent,
    ItemPerformaceComponent,
    InnovationTypeComponent,
    EditProfilerComponent,
    TimePeriodComponent,
    ItemsLandingComponent,
    ItemListComponent,
    ItemDetailsComponent,
    ItemPicturesComponent,
    ImageComponent,
    ActivityIntensityComponent,
    LxSubTypesComponent,
    InnovationCharacteristicsComponent
  ],
  providers: [
    PublicImage,
    InitcapsPipe,
    DateToTimestampPipe,
    ProfilerContextService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: {
        suppressScrollX: true,
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 30
      }
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfilerModule {}
