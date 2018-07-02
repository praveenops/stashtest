import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ActivityIntensityComponent } from './activity-intensity.component';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RootComponent } from '../../root.component';
import { DATA_STATE } from '../../_store/data-states';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('ActivityIntensityComponent', () => {
  let component: ActivityIntensityComponent;
  let fixture: ComponentFixture<ActivityIntensityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UnitTestingModule, SharedModule],
      providers: [ProfilerContextService, NielsenColors],
      declarations: [ActivityIntensityComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityIntensityComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should verify the spinner screen while loading the graph',
    fakeAsync(() => {
      fixture.detectChanges();
      component.dataState = DATA_STATE.RESOLVING;
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.spinner-container');
      expect(element).toBeTruthy();
    })
  );

  it('should verify number of columns and column titles', () => {
    expect(component.columnArray.length).toEqual(3);
    expect(component.columnArray[0].name).toEqual('Total Items');
    expect(component.columnArray[1].name).toEqual('Innovation Items');
    expect(component.columnArray[2].name).toEqual('Share of Items Count');
  });

  it('should verify Total Items and Innovation Items data are right aligned', () => {
    expect(component.columnArray[0].textAlign).toEqual('right');
    expect(component.columnArray[1].textAlign).toEqual('right');
  });

  it('resposive width calculations when screen width is greater than 511.5', () => {
    component.responsiveWidthCalc(600);
    expect(component.activityIntensityConfig.flex).toEqual({
      titles: 1.9,
      totalItems: 0.75,
      innovationItems: 0.75,
      shareOfItemsCount: 4
    });
    expect(component.activityIntensityConfig.tickValues).toEqual([
      20,
      40,
      60,
      80
    ]);
  });
  it('resposive width calculations when screen width is less than 511.5', () => {
    component.responsiveWidthCalc(400);
    expect(component.activityIntensityConfig.flex).toEqual({
      titles: 2.2,
      totalItems: 1.5,
      innovationItems: 1.5,
      shareOfItemsCount: 4
    });
    expect(component.activityIntensityConfig.tickValues).toEqual([]);
  });
});
