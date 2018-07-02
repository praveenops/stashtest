import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { UnauthorizedComponent } from './shared/components/unauthorized.component/unauthorized.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';
import { SharedModule } from './shared/shared.module';
import { IonAppRoutingModule } from './app-routing.module';
import { appReducers } from './_store/app-reducers';
import { environment } from '../environments/environment';
import { FEATURE } from './features';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appEffects } from './_store/app-effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptor } from './api.interceptor';
import { AppService } from './app.service';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { PolymerModule } from '@codebakery/origami';
import { FormsModule } from '@angular/forms';
import { metaReducers, rootReducers } from './_store/meta-reducers';

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonAppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot(rootReducers, { metaReducers }),
    StoreModule.forFeature(FEATURE.APP, appReducers),
    EffectsModule.forRoot(appEffects),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Book Store DevTools',
      logOnly: environment.production,
    }),
    FormsModule,
    PolymerModule.forRoot(),
    SharedModule,
    Angulartics2Module.forRoot([ Angulartics2GoogleTagManager ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    AppService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
