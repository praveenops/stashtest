import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { InnovationTypeComponent } from './innovation-type.component';
import { DATA_STATE } from '../../_store/data-states';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RootComponent } from '../../root.component';
import { ProfilerContextService } from '../profiler-context-service';
import { NielsenColors } from 'ion-ui-components';

describe('InnovationTypeComponent', () => {
  let component: InnovationTypeComponent;
  let fixture: ComponentFixture<InnovationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InnovationTypeComponent],
      imports: [UnitTestingModule, SharedModule],
      providers: [ProfilerContextService, NielsenColors],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationTypeComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
        'state': 'RESOLVED',
        'data': {
          'innovationTypes': [
            {
              'id': '-1170661728',
              'name': 'New Brand/Brand Extension',
              'innovationSales': 28292855,
              'innovationItemCount': 77,
              'shortName': 'New BR/ BR Ext',
              'contribution': 17
            }
          ],
          'manufacturers': [
            {
              'id': '241256',
              'name': 'BIC',
              'level': 'Manufacturer Level',
              'innovationItemCount': 109,
              'innovationTypes': [
                {
                  'id': '-1170661728',
                  'name': 'New Brand/Brand Extension',
                  'shortName': 'New BR/ BR Ext',
                  'contribution': 25,
                  'innovationItemCount': 14,
                  'innovationSales': 6733388
                }
              ]
            }
          ]
        },
        'message': ''
      };
      component['innovationTypeSubscription'](data);
      tick(1000);
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.innovationtype');
      expect(element).toBeTruthy();
    }));

  });

});
