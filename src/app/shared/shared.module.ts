import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HelpMessageComponent } from './components/help-message/help-message.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { OrdinalDate } from './pipes/ordinal-date.pipe';
import { ErrorComponent } from './components/error/error.component';
import { PublicImage } from './pipes/public-image.pipe';
import { ViewResolvingDirective } from './directives/view-switch/view-resolving.directive';
import { ViewResolvedDirective } from './directives/view-switch/view-resolved.directive';
import { ViewErrorDirective } from './directives/view-switch/view-error.directive';
import { ViewEmptyDirective } from './directives/view-switch/view-empty.directive';
import { ViewSwitchDirective } from './directives/view-switch/view-switch.directive';
import { InitcapsPipe } from './pipes/init-cap.pipe';
import { DateToTimestampPipe } from './pipes/date-to-timestamp.pipe';
import { OutletWrapperComponent } from './components/outlet-wrapper/outlet-wrapper.component';
import { FeatureToggleDirective } from './directives/feature-toggle.directive';
import { ViewInvalidDirective } from './directives/view-switch/view-invalid.directive';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FilterComponent } from './components/filter/ion-filter.component';
import { FormsModule } from '@angular/forms';

const components = [
  // add components here
  FilterComponent,
  PageNotFoundComponent,
  HelpMessageComponent,
  SpinnerComponent,
  ErrorComponent,
  OrdinalDate,
  PublicImage,
  InitcapsPipe,
  ViewSwitchDirective,
  ViewResolvingDirective,
  ViewResolvedDirective,
  ViewErrorDirective,
  ViewEmptyDirective,
  DateToTimestampPipe,
  OutletWrapperComponent,
  FeatureToggleDirective,
  ViewInvalidDirective,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  declarations: [...components],
  exports: [
    ...components,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
