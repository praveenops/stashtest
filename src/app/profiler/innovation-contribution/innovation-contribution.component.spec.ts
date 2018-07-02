import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { InnovationContributionComponent } from './innovation-contribution.component';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RootComponent } from '../../root.component';
import { DATA_STATE } from '../../_store/data-states';
import { ProfilerChartData } from '../../shared/mockdata/profiler.chart.mockdata';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('InnovationContributionComponent', () => {
  let component: InnovationContributionComponent;
  let fixture: ComponentFixture<InnovationContributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UnitTestingModule, SharedModule],
      providers: [ProfilerContextService, NielsenColors],
      declarations: [InnovationContributionComponent],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationContributionComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should verify number of columns and column titles', () => {
    expect(component.columnArray.length).toEqual(3);
    expect(component.columnArray[0].name).toEqual('Total Sales');
    expect(component.columnArray[1].name).toEqual('Innovation Sales');
    expect(component.columnArray[2].name).toEqual('Amount of Sales from Innovation');
  });
  it('should verify Total Sales and Innovation Sales data are right aligned', () => {
    expect(component.columnArray[0].textAlign).toEqual('right');
    expect(component.columnArray[1].textAlign).toEqual('right');
  });

  describe(`check all views based on state`, () => {
    it(`should verify the spinner screen while loading the view`, fakeAsync(() => {
      component.dataState = 'RESOLVING';
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

    xit(`should verify the data view when state is resolved`, fakeAsync(() => {
      const data = {
        factShare: {
          state: DATA_STATE.RESOLVED,
          data: ProfilerChartData.mockData.factShare.givenData
        }
      };
      component['marketShareSubscription'](data.factShare);
      tick(1000);
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.innovation-contribution');
      expect(element).toBeTruthy();
    }));

  });

});
