import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { MarketShareComponent } from './market-share.component';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { FEATURE } from '../../features';
import { appReducers } from '../../_store/app-reducers';
import { profilerReducers } from '../_store/profiler-reducers';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { DATA_STATE } from '../../_store/data-states';
import { RootComponent } from '../../root.component';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('MarketShareComponent', () => {
  let component: MarketShareComponent;
  let fixture: ComponentFixture<MarketShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketShareComponent],
      imports: [
        UnitTestingModule,
        SharedModule,
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers)
      ],
      providers: [ProfilerContextService, NielsenColors],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketShareComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    component['store'] = fixture.debugElement.injector.get(Store);
    component.marketShareAndInnovationShare.data =
      ProfilerChartData.mockData.marketInnovationShare.expectedData;
    component.shareOfInnovationComparedToShareOfMarket.data =
      ProfilerChartData.mockData.innovationToMarket;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test default properties', () => {
    it('should test legend text,  (Test_Ids C565498) ', () => {
      expect(component.titles).toEqual(['Market Share', 'Innovation Share']);
    });
  });
  describe(`Check all views based on state`, () => {
    it(
      `should verify the spinner screen while loading the view`,
      fakeAsync(() => {
        component.dataState = DATA_STATE.RESOLVING;
        fixture.detectChanges();
        tick(1000);
        const element = fixture.nativeElement.querySelector(
          '.spinner-container'
        );
        expect(element).toBeTruthy();
      })
    );

    it(
      `should verify the error screen if error occurs`,
      fakeAsync(() => {
        component.dataState = DATA_STATE.ERROR;
        fixture.detectChanges();
        tick(1000);
        const element = fixture.nativeElement.querySelector('ion-error');
        expect(element).toBeTruthy();
      })
    );

    it(
      `should verify the view when data is resolved`,
      fakeAsync(() => {
        const data = {
          state: DATA_STATE.RESOLVED,
          data: ProfilerChartData.mockData.factShare.givenData
        };
        component['marketShareSubscription'](data);
        tick(1000);
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector(
          '.share-of-innovation'
        );
        expect(element).toBeTruthy();
      })
    );
  });
});
