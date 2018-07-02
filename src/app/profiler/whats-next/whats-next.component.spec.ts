import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { FEATURE } from '../../features';
import { profilerReducers } from '../_store/profiler-reducers';
import { appReducers } from '../../_store/app-reducers';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { DATA_STATE } from '../../_store/data-states';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { RootComponent } from '../../root.component';
import { WhatsNextComponent } from './whats-next.component';
import { ProfilerContextService } from '../profiler-context-service';

describe('WhatsNextComponent', () => {
  let component: WhatsNextComponent;
  let fixture: ComponentFixture<WhatsNextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsNextComponent],
      imports: [
        UnitTestingModule
      ],
      providers: [ProfilerContextService],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsNextComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
    component['store'] = fixture.debugElement.injector.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template', () => {

    beforeEach(() => {
    });

    it('should have a router outlet', () => {
      fixture.detectChanges();
      const debugElement = fixture.debugElement;
      expect(debugElement.query(By.css('router-outlet'))).toBeDefined();
    });

  });

});
