import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DATA_STATE } from '../../_store/data-states';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RootComponent } from '../../root.component';
import { LxSubTypesComponent } from './lx-sub-types.component';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('LxSubTypesComponent', () => {
  let component: LxSubTypesComponent;
  let fixture: ComponentFixture<LxSubTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LxSubTypesComponent],
      imports: [UnitTestingModule, SharedModule],
      providers: [ProfilerContextService, NielsenColors],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LxSubTypesComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`Check all views based on state`, () => {
    it('should verify the spinner screen while loading the graph', fakeAsync(() => {
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
      tick(1000);
      const element = fixture.nativeElement.querySelector('ion-error');
      expect(element).toBeTruthy();
    }));

    it(`should verify the empty screen when there is no data`, fakeAsync(() => {
      fixture.detectChanges();
      component.dataState = DATA_STATE.EMPTY;
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('ion-help-message');
      expect(element).toBeTruthy();
    }));

  });


});
