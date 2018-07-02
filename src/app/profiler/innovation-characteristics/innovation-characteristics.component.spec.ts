import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { FEATURE } from '../../features';
import { profilerReducers } from '../_store/profiler-reducers';
import { appReducers } from '../../_store/app-reducers';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { DATA_STATE } from '../../_store/data-states';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { RootComponent } from '../../root.component';
import { InnovationCharacteristicsComponent } from './innovation-characteristics.component';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('InnovationCharacteristicsComponent', () => {
  let component: InnovationCharacteristicsComponent;
  let fixture: ComponentFixture<InnovationCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InnovationCharacteristicsComponent],
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
    fixture = TestBed.createComponent(InnovationCharacteristicsComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
    component['store'] = fixture.debugElement.injector.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
          data:
            ProfilerChartData.mockData.factTopTenCharacteristicsData.givenData
        };
        component['innovationCharacteristicsSubscription'](data);
        tick(1000);
        fixture.detectChanges();
        const elementChart = fixture.nativeElement.querySelector(
          '.innovationCharacteristics'
        );
        expect(elementChart).toBeTruthy();
      })
    );
  });

  xdescribe('Test Graph Area, (Test_Ids C570784)', () => {
    it(
      'should test Data-Legend Area 1/4 of Graph and Data-Chart area 3/4 of Graph',
      fakeAsync(() => {
        const data = {
          state: DATA_STATE.RESOLVED,
          data:
            ProfilerChartData.mockData.factTopTenCharacteristicsData.givenData
        };
        component['innovationCharacteristicsSubscription'](data);
        tick(100);
        fixture.detectChanges();
        expect(
          fixture.nativeElement
            .querySelector('g[name="data-legend-column"]')
            .getAttribute('flex')
        ).toEqual('2');
        expect(
          fixture.nativeElement
            .querySelector('g[name="data-chart-column"]')
            .getAttribute('flex')
        ).toEqual('5');
      })
    );
  });
  describe('Should Test Error Code', () => {
    it(
      'Should test error message',
      fakeAsync(() => {
        const data = {
          state: DATA_STATE.ERROR,
          data:
            ProfilerChartData.mockData.factTopTenCharacteristicsData.givenData,
          message: 'Error Occured'
        };
        component['innovationCharacteristicsSubscription'](data);
        tick(100);
        expect(component['errorCode']).toEqual(data.message);
      })
    );
  });

  describe('rowHandleClick', () => {
    let navigateSpy;
    beforeEach(() => {
      navigateSpy = spyOn(component['router'], 'navigate');
    });

    xit('Should call navigate', () => {
      const obj = { rowIndex: 0 };
      component.rowHandleClick(obj);
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
