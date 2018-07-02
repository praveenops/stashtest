import { FeatureToggleDirective } from './feature-toggle.directive';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UnitTestingModule } from '../../unit-testing.module';
import { Store, StoreModule } from '@ngrx/store';
import { FEATURE } from '../../features';
import { appReducers } from '../../_store/app-reducers';
import { By } from '@angular/platform-browser';
import { APP_ACTIONS } from '../../_store/app-actions';

@Component({
  template: `<div *ionFeatureToggle="'ION_FEATURE_TEST'"></div>`
})
class TestFeatureToggleComponent {
}

describe('FeatureToggleDirective', () => {
  let fixture, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        UnitTestingModule,
        StoreModule.forFeature(FEATURE.APP, appReducers),
      ],
      declarations: [TestFeatureToggleComponent, FeatureToggleDirective]
    });
    fixture = TestBed.createComponent(TestFeatureToggleComponent);
    component = fixture.componentInstance;
    component['store'] = fixture.debugElement.injector.get(Store);
    // inputEl = fixture.debugElement.query(By.css('input'));
  });

  /* FUNCTIONAL TESTS */

  describe('Functional', () => {
    it('should create an instance', () => {
      const directive = new FeatureToggleDirective(null, null, null);
      expect(directive).toBeTruthy();
    });

    it('should hide without feature toggle', () => {
      // inputEl.triggerEventHandler('mouseover', null);
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBe(null);
    });

    it('should show with feature toggle enabled', () => {
      // inputEl.triggerEventHandler('mouseover', null);
      component['store'].dispatch({
        type: APP_ACTIONS.GET_FEATURE_TOGGLES_RESOLVED,
        payload: {
          data: {
            ION_FEATURE_TEST: true,
          },
        },
      });
      fixture.detectChanges();
      const el = fixture.debugElement.query(By.css('div'));
      expect(el).toBeTruthy();
    });
  });

});
