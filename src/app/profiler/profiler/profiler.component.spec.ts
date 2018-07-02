import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ProfilerComponent } from './profiler.component';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { PROFILER } from '../../shared/mockdata/profiler.metadata.mockdata';
import { StoreModule } from '@ngrx/store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FEATURE } from '../../features';
import { appReducers } from '../../_store/app-reducers';
import { profilerReducers } from '../_store/profiler-reducers';
import { DATA_STATE } from '../../_store/data-states';
import { RootComponent } from '../../root.component';
import { Store } from '@ngrx/store';
import { APP_ACTIONS } from '../../_store/app-actions';
import { ProfilerContextService } from '../profiler-context-service';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';


const projectInfo = PROFILER['METADATA']['datasetDefaults']['1']['defaults']['factContext'];
const datasetMetadata: any = PROFILER['METADATA']['datasetMetadata']['1'][0];

describe('ProfilerComponent', () => {
  let component: ProfilerComponent;
  let fixture: ComponentFixture<ProfilerComponent>;
  let tabs: HTMLElement;

  const TAB_LABELS = [
    'WHAT HAPPENED',
    'WHY',
    'WHAT\'S NEXT'
  ];

  let app;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilerComponent],
      imports: [
        RouterTestingModule, UnitTestingModule, SharedModule,
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers),
      ],
      providers: [ProfilerContextService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ProfilerComponent);
    component = fixture.componentInstance;
    app = fixture.debugElement.componentInstance;
    component['store'] = fixture.debugElement.injector.get(Store);
    component.projectInfo = projectInfo;
    component.datasetMetadata = datasetMetadata;
    spyOn(RootComponent.prototype, 'subscribe');
    component.dataState = DATA_STATE.RESOLVED;
    fixture.detectChanges();
    tick(1000);

  }));

  it('should create', () => {
    expect(app).toBeTruthy();
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
      component.dataState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.metadata-defaults');
      expect(element).toBeTruthy();
    }));
  });


  it('should match ' + TAB_LABELS[0] + ' tab label', () => {
    fixture.detectChanges();
    tabs = fixture.debugElement.query(By.css('nd-tabs')).nativeElement;
    const tabLabels = tabs.querySelectorAll('nd-tab');
    expect(tabLabels[0].innerHTML.trim()).toBe(TAB_LABELS[0]);
  });

  it('should match ' + TAB_LABELS[1] + ' tab label', () => {
    fixture.detectChanges();
    tabs = fixture.debugElement.query(By.css('nd-tabs')).nativeElement;
    const tabLabels = tabs.querySelectorAll('nd-tab');
    expect(tabLabels[1].innerHTML.trim()).toBe(TAB_LABELS[1]);
  });


  it('should verify that projectInfo should have default categories', () => {
    fixture.detectChanges();
    component.dataState = DATA_STATE.RESOLVING;
    fixture.detectChanges();
    expect(component.projectInfo.categories).toBeDefined();
  });

  describe(`Selector text in the brand bar`, () => {

    beforeEach(fakeAsync(() => {
      component.dataState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
    }));

    it('should verify selector text for default values', () => {
      component.dataState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      component.projectInfo.markets = { 'name': 'HMSM + DRIVE + SDMP', 'id': '1260419' };
      component.country = 'FR';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const defaultsEle = element.querySelector('.metadata-defaults');

      expect(defaultsEle.querySelectorAll('span')[0].innerText).toBe('Value Sales');
      expect(defaultsEle.querySelectorAll('span')[1].innerText.trim()).toBe('Razors & Blades');
      expect(defaultsEle.querySelectorAll('span')[2].innerText).toBe('FR');
      expect(defaultsEle.querySelectorAll('span')[3].innerText).toBe('HMSM + DRIVE + SDMP');
      expect(defaultsEle.querySelectorAll('span')[4].innerText).toBe('Latest 52 Weeks');
      expect(defaultsEle.querySelectorAll('span')[6].innerText).toBe('Default');
    });

    it('should verify selector text when updating "With Sales"', () => {
      component.projectInfo.factType = { id: '2', name: 'Unit Sales' };
      component.country = 'US';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const defaultsEle = element.querySelector('.metadata-defaults');
      expect(defaultsEle.querySelectorAll('span')[0].innerText).toBe('Unit Sales');
    });

    it('should verify selector text for multiple categories', () => {
      component.projectInfo.categories = PROFILER['EDIT_CONTEXT']['categories'];
      component.country = 'US';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const defaultsEle = element.querySelector('.metadata-defaults');
      expect(defaultsEle.querySelectorAll('span')[1].innerText).toContain('Sport & Energy Drinks + 2');
    });

    it(`should verify category tooltip`, () => {
      component.showToolTip = true;
      fixture.detectChanges();
      const element = fixture.nativeElement;
      const toolTip = element.querySelector('nd-tooltip');
      expect(toolTip).toBeTruthy();
      expect(toolTip.outerHTML).toContain('contextCategoryText');
    });

    it(`should verify tooltip text`, () => {
      component.projectInfo.categories = PROFILER['EDIT_CONTEXT']['categories'];
      component.country = 'US';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const toolTip = element.querySelector('nd-tooltip');
      expect(toolTip.innerText).toContain('Sport & Energy Drinks - Tea & Infusions Rtd - Water');
    });

    it('should verify selector text for single category', () => {
      component.projectInfo.categories = PROFILER['EDIT_CONTEXT']['category_single_selection'];
      component.country = 'US';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const defaultsEle = element.querySelector('.metadata-defaults');
      expect(defaultsEle.querySelectorAll('span')[1].innerText).not.toContain('Sport & Energy Drinks +');
      expect(defaultsEle.querySelectorAll('span')[1].innerText).toContain('Sport & Energy Drinks');
      expect(defaultsEle.querySelectorAll('span')[1].innerText.trim()).toBe('Sport & Energy Drinks');
    });

    it(`should verify selector text for segments`, () => {
      component.projectInfo.categories = PROFILER['EDIT_CONTEXT']['context_with_segments'];
      component.country = 'US';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const toolTip = element.querySelector('nd-tooltip');
      expect(toolTip.innerText).toContain('Sport & Energy Drinks / Carbonated - Water');
    });

    it(`should verify selector text for a segment selection`, () => {
      component.projectInfo.categories = PROFILER['EDIT_CONTEXT']['segment'];
      component.country = 'US';
      component['updateCategoryValue'](component.projectInfo.categories);
      fixture.detectChanges();

      const element = fixture.nativeElement;
      const defaultsEle = element.querySelector('.metadata-defaults');
      expect(defaultsEle.querySelectorAll('span')[1].innerText).not.toContain('Sport & Energy Drinks / Carbonated +');
      expect(defaultsEle.querySelectorAll('span')[1].innerText).toContain('Sport & Energy Drinks / Carbonated');
    });
  });

  xit('should call upsert API on change of context', () => {
    component.dataState = DATA_STATE.RESOLVED;
    component.originalProjectInfo = PROFILER.METADATA.datasetDefaults['1'].defaults.factContext;
    const contextPayload = PROFILER.METADATA.datasetDefaults['1'].defaults.factContext;
    const contextId = '5ad0480b5f3e702935e5c673';
    const storeDispatchSpy = spyOn(component['store'], 'dispatch');
    component.createOrUpdateContext(contextPayload);

    const createInput = {
      type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT,
      payload: {
        queryParams: { contextId },
        body: contextPayload
      },
    };
    expect(component['store'].dispatch).toHaveBeenCalledWith(createInput);
  });

  describe('enableApplyButton(boolean)', () => {
    it('when called with "true" should set the property "disabled" to false', () => {
      component.enableApplyButton(true);
      expect(component.disabled).toBe(false);
    });

    it('when called with "false" should set the property "disabled" to true', () => {
      component.enableApplyButton(false);
      expect(component.disabled).toBe(true);
    });
  });
});
