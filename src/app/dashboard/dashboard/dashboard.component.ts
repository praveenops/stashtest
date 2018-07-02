import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { APP_ACTIONS } from '../../_store/app-actions';
import { DASHBOARD_ACTIONS } from '../_store/dashboard-actions';
import { FEATURE } from '../../features';
import { DASHBOARD_REDUCERS } from '../_store/dashboard-reducers';
import { TypeArray, TypeObject } from '../../_store/types';
import { DATA_STATE } from '../../_store/data-states';
import { PROFILER_ACTIONS } from '../../profiler/_store/profiler-actions';
import { RootComponent } from '../../root.component';
import { APP_REDUCERS } from '../../_store/app-reducers';


@Component({
  selector: 'ion-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends RootComponent implements OnInit {
  @ViewChild('slideDown') slideDown;

  actionTitle: String = '';
  linkTitle: String = '';
  icon: String = '';

  featureToggles = {
    timeline: 'ION_FEATURE_TIMELINE',
    benchmarker: 'ION_FEATURE_BENCHMARKER',
  };

  tabPages = [{
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

  countries: TypeArray<any> = {
    state: DATA_STATE.INITIAL,
    data: [],
  };
  countryCategoriesMap: TypeObject<any> = {
    state: DATA_STATE.INITIAL,
    data: {},
  };
  categories = [];
  selectedCountry = '';
  selectedCategory: any;

  activeTabIndex = 0;

  dataState: DATA_STATE = DATA_STATE.RESOLVING;
  errorCode: any;

  constructor(
    private store: Store<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }
  ngOnInit() {

    super.subscribe({
      store: this.store,
      feature: FEATURE.APP,
      reducer: APP_REDUCERS.APP_REDUCER,
      state: 'featureToggles'
    }, (featureFlags) => {
      if (featureFlags.state === DATA_STATE.RESOLVED) {
        this.tabPages = this.tabPages.map(tabPage => {
          tabPage.featureEnabled = !tabPage.featureToggle || !!featureFlags.data[tabPage.featureToggle];
          return tabPage;
        });
      }
    });

    this.activatedRoute.url.subscribe((url) => {
      const routePath = url[0].path;
      const featureEnabledTabs = this.tabPages.filter(t => t.featureEnabled);
      let index = 0;
      for (; index < featureEnabledTabs.length; index++) {
        if (featureEnabledTabs[index].route.indexOf(routePath) > -1) {
          break;
        }
      }
      if (index < featureEnabledTabs.length) {
        this.activateTab(routePath, index);
      } else {
        // route isn't valid. redirect to 404
        this.router.navigate(['/404']);
      }
    });

    super.subscribe([{
      store: this.store,
      feature: FEATURE.DASHBOARD,
      reducer: DASHBOARD_REDUCERS.USER_PREFERENCES,
    }, {
      store: this.store,
      feature: FEATURE.DASHBOARD,
      reducer: DASHBOARD_REDUCERS.DATA_SET_MAPPING,
    }], ([userPreference, datasetMapping]) => {
      this.handleData(userPreference, datasetMapping);
    }
    );

  }
  private dispatchUserPreference() {
    this.store.dispatch({
      type: DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE
    });
  }
  private dispatchDatasetMapping() {
    this.store.dispatch({
      type: DASHBOARD_ACTIONS.FETCH_DATASETS
    });
  }
  private handleData(userPreference, datasetMapping) {
    const userPreferenceState = userPreference.country.state;
    const datasetMappingState = datasetMapping.countries.state;

    if (userPreferenceState === datasetMappingState) {
      switch (userPreferenceState) {
        case DATA_STATE.INITIAL:
          this.dispatchUserPreference();
          this.dispatchDatasetMapping();
          break;
        case DATA_STATE.RESOLVED:
          this.dataState = DATA_STATE.RESOLVED;
          this.selectedCountry = userPreference.country.data;
          this.selectedCategory = userPreference.category.data;
          this.countries = datasetMapping.countries;
          this.countryCategoriesMap = datasetMapping.countryCategoriesMap;
          this.resetCategories();
          break;
      }
    }
    if ([userPreferenceState, datasetMappingState].includes(DATA_STATE.ERROR)) {

      this.dataState = DATA_STATE.ERROR;
      this.errorCode = userPreferenceState === DATA_STATE.ERROR ?
        userPreference.country.message : datasetMapping.countries.message;
    }
  }


  activateTab(routeUrl, tabIndex) {
    this.activeTabIndex = tabIndex;

    switch (routeUrl) {
      case 'profiler':
        this.actionTitle = 'Should I innovate?';
        this.linkTitle = 'find out';
        this.icon = 'ion:profiler';

        this.store.dispatch({
          type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE,
          payload: {
            data: {
              title: 'Profiler'
            },
          }
        });
        break;
      case 'timeline':
        this.icon = 'ion:timeline';
        this.actionTitle = 'coming soon';
        this.linkTitle = '';
        this.store.dispatch({
          type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE,
          payload: {
            data: {
              title: 'Timeline'
            },
          }
        });
        break;
      case 'benchmarker':
        this.actionTitle = 'coming soon';
        this.icon = 'ion:benchmarker';
        this.linkTitle = '';
        this.store.dispatch({
          type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE,
          payload: {
            data: {
              title: 'Benchmarker'
            }
          }
        });
        break;
      default:
      // do nothing
    }
  }

  onSelection(selection, e) {
    switch (selection) {
      case 'country':
        this.selectedCountry = e.target.selected;
        this.resetCategories();
        break;

      case 'category':
        this.selectedCategory = e.target.selected;
    }
  }

  showSlideInModal() {
    this.slideDown.open();
  }

  private clearStore() {
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_MARKET_SHARE_RESET_TO_INITIAL
    });
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_RESET_TO_INITIAL
    });
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_INNOVATION_TYPE_RESET_TO_INITIAL
    });
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_LX_SUBTYPES_RESET_TO_INITIAL
    });
    this.store.dispatch({
      type: PROFILER_ACTIONS.CLEAR_STORE,
    });
  }

  private saveUserPreference() {
    const userPreference = {
      profiler: {
        country: this.selectedCountry,
        contextId: this.selectedCategory
      }
    };
    this.store.dispatch({
      type: DASHBOARD_ACTIONS.SAVE_USER_PREFERENCE,
      payload: {
        body: userPreference
      }
    });
  }

  getStarted() {
    this.clearStore();
    this.saveUserPreference();
    this.router.navigate(['/profiler', this.selectedCategory, 'new']);
  }

  resetCategories() {
    if (this.selectedCountry && this.countryCategoriesMap) {
      if (this.countryCategoriesMap.data[this.selectedCountry]) {
        this.categories = this.countryCategoriesMap.data[this.selectedCountry]
          .map(c => ({ 'name': c.category, 'value': c.contextId }));
      } else {
        this.categories = [];
      }

      if (this.categories.length) {
        this.selectedCategory = this.categories.find(c => c.value === this.selectedCategory) ?
          this.selectedCategory : this.categories[0].value;
      }
    }
  }
}
