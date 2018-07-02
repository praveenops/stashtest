import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { IonDataVisualizationsModule } from 'ion-ui-components';
// import { appEffects } from './_store/app-effects';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  imports: [
    // HttpClientModule,
    // HttpClientTestingModule,
    // RouterTestingModule,
    StoreModule.forRoot({}),
    // EffectsModule.forRoot(appEffects)
  ],
  exports: [
    RouterTestingModule,
    // IonDataVisualizationsModule,
  ],
  providers: [],
})
export class UnitTestingModule { }
