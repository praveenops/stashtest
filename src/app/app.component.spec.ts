import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UnitTestingModule } from './unit-testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from './_store/reducers/app.reducer';
import { FEATURE } from './features';
import { appReducers } from './_store/app-reducers';
import { AppService } from './app.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_SERVICE_MOCK } from './shared/mockdata/app.service.mockdata';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { Angulartics2Module } from 'angulartics2';

describe('AppComponent', () => {
  let fixture;
  let app;
  let store: Store<AppState>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        UnitTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forFeature(FEATURE.APP, appReducers),
        Angulartics2Module.forRoot([ Angulartics2GoogleTagManager ])
      ],
      providers: [
        AppService
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    store = fixture.debugElement.injector.get(Store);

  }));

  it('should create the app', async(() => {
    spyOn(app.store, 'select');
    expect(app).toBeTruthy();
  }));

  it(`should navigate to home page when user clicks on 'Nielsen Innovation' title`, () => {
    spyOn(app['router'], 'navigate');
    app.onTitleClick();
    expect(app['router'].navigate).toHaveBeenCalledWith(['/']);
  });

  it(`should have 'nd-brand-bar-light' when in develpoment environment`, () => {
    app.isProd = false;
    fixture.detectChanges();
    const ele = fixture.nativeElement.querySelector('nd-brand-bar-light');
    expect(ele).toBeTruthy();

  });

  it(`should have 'nd-brand-bar' when in production environment`, fakeAsync(() => {
    app.isProd = true;
    const spy = spyOn(app, 'ngAfterViewInit');
    fixture.detectChanges();
    tick(1000);
    expect(spy).toHaveBeenCalled();
    const ele = fixture.nativeElement.querySelector('nd-brand-bar');
    expect(ele).toBeTruthy();
  }));
  it(`should have 'nd-brand-bar-light title' when in develpoment environment`, fakeAsync(() => {
    app.isProd = false;
    app.brandBar.title = 'Nielsen Innovation';
    const spy = spyOn(app, 'ngOnInit');
    fixture.detectChanges();
    tick(1000);
    const ele = fixture.nativeElement.querySelector('nd-brand-bar-light');
    expect(ele).toBeTruthy();
    expect(ele.getAttribute('page-title')).toBe('Nielsen Innovation');
  }));

  it(`should have 'nd-brand-bar title' when in production environment`, fakeAsync(() => {
    app.isProd = true;
    app.brandBar.title = 'Nielsen Innovation';
    const spyInit = spyOn(app, 'ngOnInit');
    const spy = spyOn(app, 'ngAfterViewInit');
    fixture.detectChanges();
    tick(1000);
    const ele = fixture.nativeElement.querySelector('nd-brand-bar');
    expect(ele).toBeTruthy();
    expect(ele.getAttribute('page-title')).toBe('Nielsen Innovation');
  }));
});
