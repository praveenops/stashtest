import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePeriodComponent } from './time-period.component';
import { UnitTestingModule } from '../../unit-testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TimePeriodComponent', () => {
  let component: TimePeriodComponent;
  let fixture: ComponentFixture<TimePeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePeriodComponent ],
      imports: [ UnitTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePeriodComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
