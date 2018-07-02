import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { UnitTestingModule } from '../../unit-testing.module';
import { WhyIsHappeningComponent } from './why-is-happening.component';
import {appReducers} from '../../_store/app-reducers';
import {StoreModule} from '@ngrx/store';
import {FEATURE} from '../../features';
import {APP_ACTIONS} from '../../_store/app-actions';

describe('WhyIsHappeningComponent', () => {
  let component: WhyIsHappeningComponent;
  let fixture: ComponentFixture<WhyIsHappeningComponent>;

  const TAB_LABELS: Array<string> = ['Activity Intensity', 'Item Performance', 'Innovation Type', 'LX Sub-Types'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhyIsHappeningComponent],
      imports: [
        RouterTestingModule,
        UnitTestingModule,
        StoreModule.forFeature(FEATURE.APP, appReducers),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents(); // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WhyIsHappeningComponent);
    component = fixture.componentInstance;


  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should select "' + TAB_LABELS[0] + '" tab by default', () => {
    expect(component.selectedTab).toBe(0);
  });

  xit('should match "' + TAB_LABELS[0] + '" tab label', () => {
    fixture.detectChanges();
    const tabs: HTMLElement = fixture.debugElement.query(By.css('nd-tabs')).nativeElement;
    const tabLabels = tabs.querySelectorAll('nd-tab');
    expect(tabLabels[0].innerHTML).toContain(TAB_LABELS[0]);
  });

  xit('should match "' + TAB_LABELS[1] + '" tab label', () => {
    fixture.detectChanges();
    const tabs: HTMLElement = fixture.debugElement.query(By.css('nd-tabs')).nativeElement;
    const tabLabels = tabs.querySelectorAll('nd-tab');
    expect(tabLabels[1].innerHTML).toContain(TAB_LABELS[1]);
  });

  xit(`should test tabs with feature flags`, fakeAsync(() => {
    const spy = spyOn(component, 'onRouteChange');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();

    let ele = fixture.nativeElement;
    let ndTabsEle = ele.querySelector('nd-tabs').querySelectorAll('nd-tab');
    expect(ndTabsEle.length).toBe(4);
    expect(ndTabsEle[0].innerHTML).toContain('Activity Intensity');
    expect(ndTabsEle[1].innerHTML).toContain('Item Performance');
    expect(ndTabsEle[2].innerHTML).toContain('Innovation Type');
    expect(ndTabsEle[3].innerHTML).toContain('LX Sub-Types');

    const features = {
      'ION_FEATURE_LX_SUB_TYPES': true,
      'ION_FEATURE_ACTIVITY_INTENSITY': true,
      'ION_FEATURE_BENCHMARKER': true
    };

    component['store'].dispatch({
      type: APP_ACTIONS.GET_FEATURE_TOGGLES_RESOLVED,
      payload: {
        data: features
      }
    });
    tick(100);
    fixture.detectChanges();

    ele = fixture.nativeElement;
    ndTabsEle = ele.querySelector('nd-tabs').querySelectorAll('nd-tab');
    expect(ndTabsEle.length).toBe(4);
    expect(ndTabsEle[0].innerHTML).toContain('Activity Intensity');
    expect(ndTabsEle[1].innerHTML).toContain('Item Performance');
    expect(ndTabsEle[2].innerHTML).toContain('Innovation Type');
    expect(ndTabsEle[3].innerHTML).toContain('LX Sub-Types');
  }));

});
