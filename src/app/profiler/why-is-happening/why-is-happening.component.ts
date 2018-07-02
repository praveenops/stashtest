import { Component, OnInit, OnDestroy, ElementRef, ViewChildren } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { RootComponent } from '../../root.component';
import { Store } from '@ngrx/store';
import { FEATURE } from '../../features';
import { APP_REDUCERS } from '../../_store/app-reducers';
import { DATA_STATE } from '../../_store/data-states';

@Component({
  selector: 'ion-why-is-happening',
  templateUrl: './why-is-happening.component.html',
  styleUrls: ['./why-is-happening.component.scss']
})
export class WhyIsHappeningComponent extends RootComponent implements OnInit, OnDestroy {
  selectedTab: any = 0;
  routerEventSub = null;

  toggleTabs = true;
  tabPages = [{
    route: 'activity-intensity',
    label: 'Activity Intensity',
    featureToggle: 'ION_FEATURE_ACTIVITY_INTENSITY',
    featureEnabled: true,
  }, {
    route: 'item-performance',
    label: 'Item Performance',
    featureToggle: '',
    featureEnabled: true,
  }, {
    route: 'innovation-type',
    label: 'Innovation Type',
    featureToggle: '',
    featureEnabled: true,
  }, {
    route: 'lx-sub-types',
    label: 'LX Sub-Types',
    featureToggle: 'ION_FEATURE_LX_SUB_TYPES',
    featureEnabled: true,
  }];

  constructor(
    private router: Router,
    private store: Store<any>,
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

    // handling the first time/refresh event
    if (this.router.url) {
      this.onRouteChange(this.router.url);
    }

    // handling internal event changes
    this.routerEventSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const e: NavigationEnd = event;
        this.onRouteChange(e.urlAfterRedirects || e.url);
      }
    });
  }

  ngOnDestroy() {
    this.routerEventSub.unsubscribe();
  }

  onRouteChange(path: string) {
    const featureEnabledTabs = this.tabPages.filter(t => t.featureEnabled);

    let index = 0;
    for (; index < featureEnabledTabs.length; index++) {
      if (path.indexOf(featureEnabledTabs[index].route) > -1) {
        break;
      }
    }

    if (index < featureEnabledTabs.length) {
      this.selectedTab = index;
    } else {
      // route isn't valid. redirect to 404
      this.router.navigate(['/404']);
    }

    this.toggleTabs = path.indexOf(`items`) === -1;
  }
}
