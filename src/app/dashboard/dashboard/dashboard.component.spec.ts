import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { PROFILER } from '../../shared/mockdata/profiler.metadata.mockdata';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { FEATURE } from '../../features';
import { dashboardReducers } from '../_store/dashboard-reducers';
import { APP_ACTIONS } from '../../_store/app-actions';
import { AppState } from '../../_store/reducers/app.reducer';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ACTIONS } from '../_store/dashboard-actions';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DATA_STATE } from '../../_store/data-states';
import { PROFILER_ACTIONS } from '../../profiler/_store/profiler-actions';
import { RootComponent } from '../../root.component';
import { appReducers } from '../../_store/app-reducers';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const DATA_SOURCE = PROFILER.TEST_DATA.dashboardComponent;
  const EXPECTED_COUNTRIES_ORDER = ['FR', 'GB'];
  const EXPECTED_CATEGORIES_ORDER = [1, 2];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        UnitTestingModule, SharedModule,
        StoreModule.forFeature(FEATURE.DASHBOARD, dashboardReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component['store'] = fixture.debugElement.injector.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have 'Profiler' as the default selection`, () => {
    expect(component.activeTabIndex).toBe(0);
  });

  it(`should have 'tabPages' with size 3`, () => {
    const tabPages = [{
      route: '/profiler',
      label: 'Profiler',
      featureToggle: '',
      featureEnabled: true,
    }, {
      route: '/timeline',
      label: 'Timeline',
      featureToggle: 'ION_FEATURE_TIMELINE',
      featureEnabled: false,
    }, {
      route: '/benchmarker',
      label: 'Benchmarker',
      featureToggle: 'ION_FEATURE_BENCHMARKER',
      featureEnabled: false,
    }];
    expect(component.tabPages.length).toBe(3);

    for (let i = 0; i < 3; i++) {
      expect(component.tabPages[i].route).toBe(tabPages[i].route);
      expect(component.tabPages[i].label).toBe(tabPages[i].label);
      expect(component.tabPages[i].featureToggle).toBe(tabPages[i].featureToggle);
      expect(component.tabPages[i].featureEnabled).toBe(tabPages[i].featureEnabled);
    }
  });

  it(`should have 2 feature flags`, () => {
    const featureToggles = {
      timeline: 'ION_FEATURE_TIMELINE',
      benchmarker: 'ION_FEATURE_BENCHMARKER',
    };

    expect(Object.keys(component.featureToggles).length).toBe(2);
    expect(component.featureToggles.timeline).toBe(featureToggles.timeline);
    expect(component.featureToggles.benchmarker).toBe(featureToggles.benchmarker);

  });

  it(`should dataState initial value be 'RESOLVING'`, () => {
    expect(component.dataState).toBe(DATA_STATE.RESOLVING);
  });

  // Testing Methods

  describe(`activateTab`, () => {
    it(`should change title to 'PROFILER' when user clicks on Profiler tab`, () => {
      component.activeTabIndex = 1;

      spyOn(component['store'], 'dispatch');

      component.activateTab('profiler', 0);

      expect(component.activeTabIndex).toBe(0);
      expect(component.actionTitle).toBe('Should I innovate?');
      expect(component.linkTitle).toBe('find out');
      expect(component.icon).toBe('ion:profiler');

      const input = {
        type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE,
        payload: {
          data: {
            title: 'Profiler',
          },
        }
      };

      expect(component['store'].dispatch).toHaveBeenCalledWith(input);

    });

    it(`should show coming soon when user clicks on Timeline tab`, () => {

      component.activeTabIndex = 0;

      spyOn(component['store'], 'dispatch');

      component.activateTab('timeline', 1);

      expect(component.activeTabIndex).toBe(1);
      expect(component.actionTitle).toBe('coming soon');
      expect(component.linkTitle).toBe('');
      expect(component.icon).toBe('ion:timeline');

      const input = {
        type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE, payload: {
          data: {
            title: 'Timeline',
          },
        }
      };

      expect(component['store'].dispatch).toHaveBeenCalledWith(input);

    });

    it(`should show coming soon when user clicks on Benchmarker tab`, () => {

      component.activeTabIndex = 0;

      spyOn(component['store'], 'dispatch');

      component.activateTab('benchmarker', 2);

      expect(component.activeTabIndex).toBe(2);
      expect(component.actionTitle).toBe('coming soon');
      expect(component.linkTitle).toBe('');
      expect(component.icon).toBe('ion:benchmarker');

      const input = {
        type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE, payload: {
          data: {
            title: 'Benchmarker',
          },
        }
      };
      expect(component['store'].dispatch).toHaveBeenCalledWith(input);

    });

  });

  describe(`getStarted`, () => {
    it(`should navigate to 'profiler' when user clicks on getStarted`, () => {
      const spyClearStore = spyOn<any>(component, 'clearStore');
      const spySaveUserPreference = spyOn<any>(component, 'saveUserPreference');
      spyOn(component['router'], 'navigate');
      component.selectedCategory = '5acf78b65f3e7064546bb383';

      component.getStarted();

      expect(spyClearStore).toHaveBeenCalled();
      expect(spySaveUserPreference).toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith(['/profiler', '5acf78b65f3e7064546bb383', 'new']);
    });
  });

  describe(`clearStore`, () => {
    it(`should dispatch clearStore when clearStore called`, () => {
      const spy = spyOn(component['store'], 'dispatch');

      component['clearStore']();

      const calledWith = {
        type: PROFILER_ACTIONS.CLEAR_STORE,
      };
      expect(spy).toHaveBeenCalledWith(calledWith);
    });
  });

  describe(`saveUserPreference`, () => {
    it(`should dispatch saveUserPreference when saveUserPreference called`, () => {
      const spy = spyOn(component['store'], 'dispatch');

      component.selectedCountry = 'US';
      component.selectedCategory = '5acf78b65f3e7064546bb383';

      component['saveUserPreference']();

      const userPreference = {
        profiler: {
          country: 'US',
          contextId: '5acf78b65f3e7064546bb383'
        }
      };

      const calledWith = {
        type: DASHBOARD_ACTIONS.SAVE_USER_PREFERENCE,
        payload: {
          body: userPreference
        }
      };
      expect(spy).toHaveBeenCalledWith(calledWith);
    });
  });

  describe(`handleData`, () => {
    it(`should dispatch userPreference and DatasetMapping when both states are INITIAL`, () => {
      const datasetMapping = {
        countries: {
          state: DATA_STATE.INITIAL,
          data: []
        },
        countryCategoriesMap: {
          state: DATA_STATE.INITIAL,
          data: {}
        },
      };

      const userPreference = {
        country: {
          state: DATA_STATE.INITIAL,
          data: ''
        },
        category: {
          state: DATA_STATE.INITIAL,
          data: NaN,
        },
      };

      const spyDispatchUserPreference = spyOn<any>(component, 'dispatchUserPreference');
      const spyDispatchDatasetMapping = spyOn<any>(component, 'dispatchDatasetMapping');

      component['handleData'](userPreference, datasetMapping);

      expect(spyDispatchUserPreference).toHaveBeenCalled();
      expect(spyDispatchDatasetMapping).toHaveBeenCalled();
      expect(component.dataState).toBe(DATA_STATE.RESOLVING);

    });

    it(`should set dataState to ERROR when userPreference state is ERROR`, () => {
      const datasetMapping = {
        countries: {
          state: DATA_STATE.INITIAL,
          data: []
        },
        countryCategoriesMap: {
          state: DATA_STATE.INITIAL,
          data: {}
        },
      };

      const userPreference = {
        country: {
          state: DATA_STATE.ERROR,
          data: ''
        },
        category: {
          state: DATA_STATE.INITIAL,
          data: NaN,
        },
      };
      component['handleData'](userPreference, datasetMapping);

      expect(component.dataState).toBe(DATA_STATE.ERROR);
    });

    it(`should set dataState to ERROR when datasetMapping state is ERROR`, () => {
      const datasetMapping = {
        countries: {
          state: DATA_STATE.ERROR,
          data: []
        },
        countryCategoriesMap: {
          state: DATA_STATE.INITIAL,
          data: {}
        },
      };

      const userPreference = {
        country: {
          state: DATA_STATE.INITIAL,
          data: ''
        },
        category: {
          state: DATA_STATE.INITIAL,
          data: NaN,
        },
      };
      component['handleData'](userPreference, datasetMapping);

      expect(component.dataState).toBe(DATA_STATE.ERROR);
    });
    it(`should set data, state to RESOLVED and call resetCategories when both states are RESOLVED`, () => {

      const spy = spyOn(component, 'resetCategories');

      const datasetMapping = {
        countries: {
          state: DATA_STATE.RESOLVED,
          data: [
            {
              name: 'France',
              value: 'FR'
            },
            {
              name: 'Great Britain',
              value: 'GB'
            },
            {
              name: 'United States of America',
              value: 'US'
            }
          ],
          message: ''
        },
        countryCategoriesMap: {
          state: DATA_STATE.RESOLVED,
          data: {
            FR: [
              {
                name: 'Innovations_Profiler_Agg',
                datasetId: 1,
                category: 'RAZOR & BLADES'
              }
            ],
            GB: [
              {
                name: 'Innovations_Profiler_Molson_Agg',
                datasetId: 2,
                category: 'BEER & CIDER'
              }
            ],
            US: [
              {
                name: 'Innovations_Profiler_Agg_Coke',
                datasetId: 3,
                category: 'SPORT & ENERGY DRINKS'
              }
            ]
          },
          message: ''
        }
      };

      const userPreference = {
        country: {
          data: 'FR',
          state: DATA_STATE.RESOLVED,
          message: ''
        },
        category: {
          data: 1,
          state: DATA_STATE.RESOLVED,
          message: ''
        }
      };

      component['handleData'](userPreference, datasetMapping);

      expect(component.selectedCountry).toBe('FR');
      expect(component.selectedCategory).toBe(1);

      expect(component.countries).toBe(datasetMapping.countries);
      expect(component.countryCategoriesMap).toBe(datasetMapping.countryCategoriesMap);

      expect(component.dataState).toBe(DATA_STATE.RESOLVED);
      expect(spy).toHaveBeenCalled();
    });

  });

  it(`should test tabs with feature flags`, fakeAsync(() => {

    const spy = spyOn<any>(component, 'handleData');

    fixture.detectChanges();
    const ele = fixture.nativeElement;

    let ndTabsEle = ele.querySelector('nd-toolbar').querySelector('nd-tabs').querySelectorAll('nd-tab');
    expect(ndTabsEle.length).toBe(1);
    expect(ndTabsEle[0].getAttribute('ng-reflect-router-link')).toBe('/profiler');

    expect(spy).toHaveBeenCalled();

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

    ndTabsEle = ele.querySelector('nd-toolbar').querySelector('nd-tabs').querySelectorAll('nd-tab');
    expect(ndTabsEle.length).toBe(2);
    expect(ndTabsEle[0].getAttribute('ng-reflect-router-link')).toBe('/profiler');
    expect(ndTabsEle[1].getAttribute('ng-reflect-router-link')).toBe('/benchmarker');
  }));

  it(`should show loader when dataState is in Resolving state`, fakeAsync(() => {
    spyOn(RootComponent.prototype, 'subscribe');
    fixture.detectChanges();
    tick(100);
    expect(fixture.nativeElement.querySelector('.pdm-mapping').querySelector('nd-spinner-lite')).toBeTruthy();
  }));
  describe(`ngOnInit`, () => {
    it(`should call ngOnInit when fixture.detectChanges`, () => {
      const spy = spyOn(component, 'ngOnInit');
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it(`should call handleData when onInit with INITIAL state`, fakeAsync(() => {

      const spy = spyOn<any>(component, 'handleData');

      fixture.detectChanges();

      tick(100);

      const datasetMapping = {
        countries: {
          state: DATA_STATE.INITIAL,
          data: []
        },
        countryCategoriesMap: {
          state: DATA_STATE.INITIAL,
          data: {}
        }
      };

      const userPreference = {
        country: {
          state: DATA_STATE.INITIAL,
          data: ''
        },
        category: {
          state: DATA_STATE.INITIAL,
          data: NaN,
        },
      };

      expect(spy).toHaveBeenCalledWith(userPreference, datasetMapping);

    }));

    it(`should call handleData when dispatch with RESOLVED state`, fakeAsync(() => {

      fixture.detectChanges();

      tick(100);

      const mockResponseUserPreference = {
        'success': true,
        'statusMsg': 'user found',
        'userDetails': {
          'email': 'ion.testuser@nielsen.com',
          '_id': '5acf90865f3e70556f3918eb',
          'profiler': {
            'country': 'FR',
            'contextId': '5acf78b65f3e7064546bb37f'
          }
        }
      };

      const mockResponseDatasetMapping = [
        {
          'country': 'FR',
          'datasets': [
            {
              'name': 'Innovations_Profiler_Agg',
              'contextId': '5acf78b65f3e7064546bb37f',
              'category': 'RAZOR & BLADES',
              'datasetId': 1
            }
          ]
        }
      ];

      const spy = spyOn<any>(component, 'handleData');


      component['store'].dispatch({
        type: DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE_RESOLVED,
        payload: {
          data: mockResponseUserPreference
        }
      });
      component['store'].dispatch({
        type: DASHBOARD_ACTIONS.FETCH_DATASETS_RESOLVED,
        payload: {
          data: mockResponseDatasetMapping
        }
      });

      tick(100);


      const datasetMapping = {
        'countries': {
          'state': 'RESOLVED',
          'data': [
            {
              'name': 'France',
              'value': 'FR'
            }
          ],
          'message': ''
        },
        'countryCategoriesMap': {
          'state': 'RESOLVED',
          'data': {
            'FR': [
              {
                'category': 'RAZOR & BLADES',
                'contextId': '5acf78b65f3e7064546bb37f',
                'datasetId': 1,
                'name': 'Innovations_Profiler_Agg'
              }
            ]
          },
          'message': ''
        }
      };

      const userPreference = {
        'country': {
          'state': 'RESOLVED',
          'data': 'FR',
          'message': ''
        },
        'category': {
          'state': 'RESOLVED',
          'data': '5acf78b65f3e7064546bb37f',
          'message': ''
        }
      };

      expect(spy).toHaveBeenCalledWith(userPreference, datasetMapping);

    }));
  });


  // Testing template changes

  xdescribe(`Testing flow`, () => {
    it('Countries dropdown values should be in sorting order', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      const dropdownItems = element.querySelectorAll('nd-dropdown-menu');
      const countryDropdown = dropdownItems[0];

      EXPECTED_COUNTRIES_ORDER.forEach((country, index) => {
        expect(
          countryDropdown.querySelectorAll('nd-item').item(index).getAttribute('value')
        ).toBe(country);
      });
    });

    it('Category dropdown values should sync with country and in sorting order', fakeAsync(() => {
      fixture.detectChanges(); // trigger initial data binding
      // spyOn(component['store'], 'dispatch');
      spyOn<any>(component, 'dispatchUserPreference');
      tick(1000);
      // component.countries.state = DATA_STATE.RESOLVED;
      component['store'].dispatch({
        type: DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE_RESOLVED,
        payload: {
          data: {}
        }
      });
      component['store'].dispatch({
        type: DASHBOARD_ACTIONS.FETCH_DATASETS_RESOLVED,
        payload: DATA_SOURCE
      });
      component['store'].dispatch({
        type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE,
        payload: {
          data: {
            title: 'Profiler'
          },
        }
      });


      const element = fixture.nativeElement;
      const dropdownItems = element.querySelectorAll('nd-dropdown-menu');
      const categoryDropdown = dropdownItems[1];

      component.selectedCountry = EXPECTED_COUNTRIES_ORDER[0];
      component.resetCategories();

      fixture.detectChanges(); // trigger initial data binding

      expect(
        categoryDropdown.querySelectorAll('nd-item').item(0).getAttribute('value')
      ).toBe('1');
    }));

    it('Should enable \"Get start\" button after country and category selection', () => {
      // fixture.detectChanges(); // trigger initial data binding
      const element = fixture.nativeElement;
      const dropdownItems = element.querySelectorAll('nd-dropdown-menu');

      component.selectedCountry = EXPECTED_COUNTRIES_ORDER[0];
      component.resetCategories();

      component.selectedCategory = EXPECTED_CATEGORIES_ORDER[0];
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('[name=\'get-start-btn\']')).nativeElement.hasAttribute('disabled')).toBe(false);
    });

    it('First Value should be selected by default for country and category', () => {
      fixture.detectChanges(); // trigger initial data binding
      component['store'].dispatch({
        type: DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE_RESOLVED,
        payload: {
          data: {
            success: true,
            userDetails: {
              profiler: { country: EXPECTED_COUNTRIES_ORDER[1], datasetId: 2 }
            }
          }
        }
      });

      const element = fixture.nativeElement;
      const dropdownItems = element.querySelectorAll('nd-dropdown-menu');
      const categoryDropdown = dropdownItems[1];

      expect(component.selectedCountry).toBe(EXPECTED_COUNTRIES_ORDER[1]);
      component.resetCategories();

      expect('' + component.selectedCategory).toBe('2');
    });

    it(`should have country/category drop-down`, () => {

      fixture.detectChanges();
      const slideDownModal = fixture.nativeElement.querySelector('ion-slide-down-modal');
      expect(slideDownModal).toBeTruthy();

      let dropDown = slideDownModal.querySelector('nd-dropdown-menu');
      expect(dropDown).toBeTruthy();
      expect(dropDown.outerHTML.toLowerCase()).toContain('choose a country');

      dropDown = slideDownModal.querySelectorAll('nd-dropdown-menu')[1];
      expect(dropDown).toBeTruthy();
      expect(dropDown.outerHTML.toLowerCase()).toContain('pick a category');
    });

    it(`should have "Get Started" button`, () => {
      component.countries.state = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      const slideDownModal = fixture.nativeElement.querySelector('ion-slide-down-modal');
      expect(slideDownModal).toBeTruthy();

      const button = slideDownModal.querySelector('nd-button');
      expect(button).toBeTruthy();
      expect(button.innerHTML.toLowerCase()).toContain('get started');
    });

  });
});
