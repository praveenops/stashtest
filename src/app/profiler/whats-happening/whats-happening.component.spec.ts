import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { UnitTestingModule } from '../../unit-testing.module';
import { WhatsHappeningComponent } from './whats-happening.component';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from '../../_store/reducers/app.reducer';
import { profilerReducers } from '../_store/profiler-reducers';
import { FEATURE } from '../../features';
import { appReducers } from '../../_store/app-reducers';

describe('WhatsHappeningComponent', () => {
  let component: WhatsHappeningComponent;
  let fixture: ComponentFixture<WhatsHappeningComponent>;
  let appStore: Store<any>;

  const TAB_LABELS: Array<string> = ['Innovation Contribution to Sales', 'Market Share vs Innovation Share'];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsHappeningComponent],
      imports: [
        RouterTestingModule,
        UnitTestingModule,
        StoreModule.forFeature(FEATURE.APP, appReducers),
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents(); // compile template and css
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WhatsHappeningComponent);
    component = fixture.componentInstance;
    appStore = fixture.debugElement.injector.get(Store);
     // trigger initial data binding
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select "' + TAB_LABELS[0] + '" tab by default', () => {
    expect(component.selectedTab).toBe(0);
  });

  it('should match "' + TAB_LABELS[0] + '" tab label', () => {
    fixture.detectChanges();
    const tabs: HTMLElement = fixture.debugElement.query(By.css('nd-tabs')).nativeElement;
    const tabLabels = tabs.querySelectorAll('nd-tab');
    expect(tabLabels[0].innerHTML).toBe(TAB_LABELS[0]);
  });

  it('should match "' + TAB_LABELS[1] + '" tab label', () => {
    fixture.detectChanges();
    const tabs: HTMLElement = fixture.debugElement.query(By.css('nd-tabs')).nativeElement;
    const tabLabels = tabs.querySelectorAll('nd-tab');
    expect(tabLabels[1].innerHTML).toBe(TAB_LABELS[1]);
  });
});
