import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemPerformaceComponent } from './item-performace.component';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { FEATURE } from '../../features';
import { profilerReducers } from '../_store/profiler-reducers';
import { appReducers } from '../../_store/app-reducers';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { DATA_STATE } from '../../_store/data-states';
import {PROFILER_ACTIONS} from '../_store/profiler-actions';
import { RootComponent } from '../../root.component';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('ItemPerformaceComponent', () => {
  let component: ItemPerformaceComponent;
  let fixture: ComponentFixture<ItemPerformaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPerformaceComponent],
      imports: [
        UnitTestingModule, SharedModule,
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers),
      ],
      providers: [ProfilerContextService, NielsenColors],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPerformaceComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
    component['store'] = fixture.debugElement.injector.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test default properties', () => {
    it('should test graph-colors  (Test_Ids C571643) ', () => {
      expect(component.rowColor).toEqual('#F5F9FC');
      expect(component.gridColor).toEqual('#D5D7DB');
      expect(component.rightChartColors).toEqual(['#9977BB']);
      expect(component.leftChartColors).toEqual(['#EEDD55', '#7798BB']);
    });
    it('should test legend text and colors,  (Test_Ids C571601) ', () => {
      expect(component.leftChartColors).toEqual(['#EEDD55', '#7798BB']);
      expect(component.titles).toEqual(['Total Items', 'Innovation Items']);
    });
  });

  describe('Test Graph title and Place holder', () => {
    xit('should test Graph title, (Test_Ids C571642)', () => {
      expect(fixture.nativeElement.querySelector('.overlay-title').innerHTML).toEqual('Item Performance');
    });
  });
  describe(`Check all views based on state`, () => {
    it(`should verify the spinner screen while loading the view`, fakeAsync(() => {
      component.dataState = DATA_STATE.RESOLVING;
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('.spinner-container');
      expect(element).toBeTruthy();
    }));

    it(`should verify the error screen if error occurs`, fakeAsync(() => {
      component.dataState = DATA_STATE.ERROR;
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('ion-error');
      expect(element).toBeTruthy();
    }));

    it(`should verify the view when data is resolved`, fakeAsync(() => {
      const data = {
        state: DATA_STATE.RESOLVED,
        data: ProfilerChartData.mockData.factShare.givenData
      };
      component['itemPerformanceSubscription'](data);
      tick(1000);
      fixture.detectChanges();
      const elementLeftChart = fixture.nativeElement.querySelector('.item-performance-average');
      const elementRightChart = fixture.nativeElement.querySelector('.item-performance-gap');
      expect(elementLeftChart).toBeTruthy();
      expect(elementRightChart).toBeTruthy();
    }));

  });

});
