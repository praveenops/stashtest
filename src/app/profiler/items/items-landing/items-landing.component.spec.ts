import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ItemsLandingComponent } from './items-landing.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { appReducers } from '../../../_store/app-reducers';
import { FEATURE } from '../../../features';
import { StoreModule } from '@ngrx/store';
import { profilerReducers } from '../../_store/profiler-reducers';
import { UnitTestingModule } from '../../../unit-testing.module';
import { SharedModule } from '../../../shared/shared.module';
import { Store } from '@ngrx/store';
import { PROFILER_ACTIONS } from '../../_store/profiler-actions';
import { APP_ACTIONS } from '../../../_store/app-actions';
import { PROFILER } from '../../../shared/mockdata/profiler.metadata.mockdata';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DATA_STATE } from '../../../_store/data-states';
import { ProfilerContextService } from '../../profiler-context-service';

describe('ItemsLandingComponent', () => {
  let component: ItemsLandingComponent;
  let fixture: ComponentFixture<ItemsLandingComponent>;
  let store: Store<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UnitTestingModule, SharedModule,
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers),
        PerfectScrollbarModule,
      ],
      providers: [ProfilerContextService],
      declarations: [ItemsLandingComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsLandingComponent);
    component = fixture.componentInstance;
    component['store'] = fixture.debugElement.injector.get(Store);
    store = fixture.debugElement.injector.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should call "getInnovationItems" on context update', () => {
    fixture.detectChanges();
    component.paramId = '241256';
    const getInnovationItemsSpy = spyOn(component, 'getInnovationItems');
    store.dispatch({
      type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVED,
      payload: {
        data: { id: 1 }
      }
    });
    store.dispatch({
      type: PROFILER_ACTIONS.SET_PROFILER_CONTEXT,
      payload: {
        data: PROFILER.METADATA.datasetDefaults['1'].defaults.factContext
      }
    });
    store.dispatch({
      type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVED,
      payload: {
        data: { id: 1 }
      }
    });
    store.dispatch({
      type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVED,
      payload: {
        data: { id: 2 }
      }
    });

    expect(getInnovationItemsSpy).toHaveBeenCalledTimes(2);
  });

  xit('should not call "getInnovationItems" multiple times if the context is not changed', () => {
    fixture.detectChanges();
    component.paramId = '241256';
    const getInnovationItemsSpy = spyOn(component, 'getInnovationItems');
    store.dispatch({
      type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVED,
      payload: {
        data: { id: 2 }
      }
    });
    store.dispatch({
      type: PROFILER_ACTIONS.SET_PROFILER_CONTEXT,
      payload: {
        data: PROFILER.METADATA.datasetDefaults['1'].defaults.factContext
      }
    });

    store.dispatch({
      type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_RESOLVED,
      payload: {
        data: { id: 2 }
      }
    });
    expect(getInnovationItemsSpy).toHaveBeenCalledTimes(1);
  });

  describe(`Check all views based on state`, () => {
    it(`should verify the spinner screen while loading the view`, fakeAsync(() => {
      fixture.detectChanges();
      component.dataState = DATA_STATE.RESOLVING;
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('.spinner-container');
      expect(element).toBeTruthy();
    }));

    it(`should verify the error screen if error occurs`, fakeAsync(() => {
      fixture.detectChanges();
      component.dataState = DATA_STATE.ERROR;
      fixture.detectChanges();
      tick(100);
      const element = fixture.nativeElement.querySelector('ion-error');
      expect(element).toBeTruthy();
    }));

    it(`should verify the view when data is resolved`, fakeAsync(() => {
      spyOn<any>(component, 'innovationItemsSubscription');
      fixture.detectChanges();
      tick(1000);

      component.dataState = DATA_STATE.RESOLVED;
      component.items = [{
        'name': 'BIC Flex 3',
        'type': 'Line EX',
        'appDate': '01/30/2017',
        'innovationSales': '1000',
        'currency': 'dollar',
        'nanKey': '10000001'
      }];
      component.slideLeft = true;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('ion-item-list');
      expect(element).toBeTruthy();
    }));

    it(`should verify the empty screen when there is no data`, fakeAsync(() => {
      fixture.detectChanges();
      component.items = [];
      component.dataState = DATA_STATE.EMPTY;
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('ion-help-message');
      expect(element).toBeTruthy();
    }));

  });

  describe('defaults', () => {

    it('EMPTY_CHECKABLE_TYPES should be "CAT, MFR, BRD, SBD"', () => {
      expect(component.EMPTY_CHECKABLE_TYPES).toEqual(['CAT', 'MFR', 'BRD', 'SBD']);
    });

    it('"currentView" should be "items"', () => {
      expect(component.currentView).toEqual('items');
    });

  });

  describe('profilerContextSubscription()', () => {
    describe('calling with RESOLVED state', () => {
      beforeEach(() => {
        component['profilerContextSubscription']({ state: DATA_STATE.RESOLVED, data: '123' });
      });

      it('Should call "getInnovationItems" when the type is "CHR" regardless of manufacturers in the context', () => {
        const getInnovationItemsSpy = spyOn(component, 'getInnovationItems');
        component['store'].dispatch({
          type: PROFILER_ACTIONS.SET_CONTEXT_ID,
          payload: {
            data: '12345'
          }
        });
        component['store'].dispatch({
          type: PROFILER_ACTIONS.SET_PROFILER_CONTEXT,
          payload: {
            data: PROFILER.METADATA.datasetDefaults['1'].defaults.factContext
          }
        });
        fixture.detectChanges();
        expect(getInnovationItemsSpy).toHaveBeenCalled();
      });
    });
  });

  describe('innovationItemsSubscription()', () => {
    beforeEach(() => {

    });

    it('Should set dataState to "EMPTY" when called with items of size "0"', () => {
      // setting the innovation items as empty
      component['store'].dispatch({
        type: PROFILER_ACTIONS.GET_INNOVATION_ITEMS_RESOLVED,
        payload: { data: {
            factType: 'Value Sales',
            currency: 'USD',
            items: []
          }
        }
      });
      component['innovationItemsSubscription']({
        state: DATA_STATE.RESOLVED,
        data: {
          factType: 'Value Sales',
          currency: 'USD',
          items: []
        }
      });
      fixture.detectChanges();
      expect(component.dataState).toBe(DATA_STATE.EMPTY);
    });
  });

});
