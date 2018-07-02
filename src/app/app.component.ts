import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { Store } from '@ngrx/store';
import { FEATURE } from './features';
import { APP_REDUCERS } from './_store/app-reducers';
import { RootComponent } from './root.component';
import { APP_ACTIONS } from './_store/app-actions';
import { DATA_STATE } from './_store/data-states';
import { AppService } from './app.service';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

@Component({
  selector: 'ion-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends RootComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('sessionTimedOut') sessionTimedOut;

  showSplashScreen = false;

  isProd = environment.production;
  productId = environment.productId;
  brandBar = {
    title: '',
    tooltip: 'Innovation Profiler',
    appIconUrl: 'https://ng2qa.azureedge.net/ui_assets/images/apps/innovation_activity.svg',
  };

  interval: any;
  isLoggedIn = true;
  constructor(
    private store: Store<any>,
    private router: Router,
    private appService: AppService,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager
  ) {
    super();
    this.routerSubscribe();
  }

  routerSubscribe() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        dataLayerPushPageview(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.fetchUID();

    super.subscribe({
      store: this.store,
      feature: FEATURE.APP,
      reducer: APP_REDUCERS.APP_REDUCER,
      state: 'brandBar'
    }, (brandBar) => {
      this.brandBar.title = brandBar.data && brandBar.data.title;
    });

    super.subscribe({
      store: this.store,
      feature: FEATURE.APP,
      reducer: APP_REDUCERS.APP_REDUCER,
      state: 'featureToggles'
    }, (featureFlags) => {
      if (featureFlags.state === DATA_STATE.ERROR) {
        // show some errors to user
        // NEEDS WORK
      }
    });

    // TODO: should be removed once we remove the splash screen
    super.subscribe({
      store: this.store,
      feature: FEATURE.APP,
      reducer: APP_REDUCERS.APP_REDUCER,
      state: 'splashScreen',
    }, (splashScreen) => {
      if (splashScreen.state === DATA_STATE.RESOLVED) {
        this.showSplashScreen = splashScreen.data;
      }
    });

    this.store.dispatch({
      type: APP_ACTIONS.GET_FEATURE_TOGGLES,
    });
  }

  fetchUID() {
    // to make a call to fetch userUID
    this.appService.getUserInfo()
      .subscribe((data: any) => {
        if (!data || !data.profilerAccessible) {
          return;
        }

        // calling global js function from gtm.js
        dataLayerPush(data.userId, data.orgName, data.emailId);
        gtm(environment.gtm);
        // console.log(data);
      });
  }

  ngAfterViewInit() {
    if (!this.isProd) {
      return;
    }

    this.startHeartBeat();

    window.onfocus = () => {
      this.startHeartBeat();
    };

    window.onblur = () => {
      this.stopHeartBeat();
    };
  }

  startHeartBeat() {
    this.interval = setInterval(() => {
      if (this.isSessionExpired()) {
        clearInterval(this.interval);
      }
    }, 3000);
  }

  stopHeartBeat() {
    this.interval && clearInterval(this.interval);
  }

  isSessionExpired() {
    if (!this.isLoggedIn) {
      return;
    }

    let isExpired = false;

    const sessionCookie = document.cookie
      .split(';')
      .map(s => s.trim().split('='))
      .filter(s => s.length && s[0] === 'NG2SESSION').shift();
    if (sessionCookie) {
      if (sessionCookie[1].trim() === 'LOGGEDOFF') {
        this.sessionTimedOut.nativeElement.open();
        isExpired = true;
      }
    }
    return isExpired;
  }

  onTitleClick() {
    this.router.navigate(['/']);
  }

  /* on logout redirecting to ng2 login page */
  onSignOutClick() {
    this.isLoggedIn = false;
    /*
      to stop the timer
     */
    this.stopHeartBeat();
    window.location.href = '/portal/ng2/logout.jsp?redirectUrl=' + encodeURIComponent(window.location.href);
  }

  reloadTab() {
    window.location.reload();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.stopHeartBeat();
  }

}
