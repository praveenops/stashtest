import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { FEATURE } from '../../features';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { DATA_STATE } from '../../_store/data-states';
import { RootComponent } from '../../root.component';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { take } from 'rxjs/internal/operators';

@Component({
  selector: 'ion-whats-happening',
  templateUrl: './whats-happening.component.html',
  styleUrls: ['./whats-happening.component.scss']
})
export class WhatsHappeningComponent extends RootComponent implements OnInit, OnDestroy {
  selectedTab: any = 0;
  routerEventSub = null;

  toggleTabs = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
  ) {
    super();
  }

  ngOnInit() {

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

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.PROFILER,
      state: 'contextId',
    }, (contextId) => {
      if (contextId.state === DATA_STATE.RESOLVED) {
        this.store
          .pipe(
            select(FEATURE.PROFILER),
            select(PROFILE_REDUCERS.MARKET_SHARE),
            select('factShare'),
            take(1),
          )
          .subscribe(factShare => {
            if (factShare.state === DATA_STATE.INITIAL) {
              this.store.dispatch({
                type: PROFILER_ACTIONS.GET_MARKET_SHARE,
                payload: {
                  queryParams: { contextId: contextId.data },
                }
              });
            }
          });
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.routerEventSub && this.routerEventSub.unsubscribe();
  }

  onRouteChange(path: string) {
    if (path.indexOf('innovation-contribution') !== -1) {
      this.selectedTab = 0;
    } else if (path.indexOf('market-share') !== -1) {
      this.selectedTab = 1;
    }
    this.toggleTabs = path.indexOf(`items`) === -1;
  }
}
