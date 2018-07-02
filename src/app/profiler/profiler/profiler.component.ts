import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { APP_ACTIONS } from '../../_store/app-actions';
import { FEATURE } from '../../features';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { OnRouteChange } from '../../app.events';
import { DATA_STATE } from '../../_store/data-states';
import { RootComponent } from '../../root.component';
import { ProfilerContextService } from '../profiler-context-service';
import { APP_REDUCERS } from '../../_store/app-reducers';
import { EditProfilerComponent } from '../edit-profiler/edit-profiler.component';

@Component({
  selector: 'ion-profiler',
  templateUrl: './profiler.component.html',
  styleUrls: ['./profiler.component.scss']
})
export class ProfilerComponent extends RootComponent implements OnInit, OnRouteChange {

  @ViewChild('slideEditModal') slideEditModal;
  @ViewChild('editProfiler') editProfiler: EditProfilerComponent;
  selectedTab: any = 0;

  tabPages = [{
    route: 'whats-happening',
    label: 'WHAT HAPPENED',
    featureToggle: '',
    featureEnabled: true,
  }, {
    route: 'why',
    label: 'WHY',
    featureToggle: '',
    featureEnabled: true,
  }, {
    route: 'whats-next',
    label: 'WHAT\'S NEXT',
    featureToggle: 'ION_FEATURE_WHATS_NEXT',
    featureEnabled: false,
  }];

  country: any;
  category: string;
  categoryToolTip: any;
  contextId: string;
  showToolTip = false;

  projectInfo: any = null;
  datasetMetadata: any;
  icon: String = '';
  errorCode: any;
  originalProjectInfo: any = null;
  isCustomInnovationDefinition = false;
  routerEventSub = null;

  dataState: string = DATA_STATE.INITIAL;

  disabled = false;
  fetchContextDetails = true;

  constructor(
    private store: Store<any>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private profilerContextService: ProfilerContextService,
  ) {
    super();
  }

  ngOnInit() {
    // handling the first time/refresh event
    if (this.activatedRoute.snapshot.firstChild != null) {
      this.onRouteChange(this.activatedRoute.snapshot.firstChild.url[0].path.split('/'));
    }

    // handling internal event changes
    this.routerEventSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const ne: NavigationEnd = event;
        this.onRouteChange((ne.urlAfterRedirects || ne.url).split('/'));
      }
    });

    this.store.dispatch({
      type: APP_ACTIONS.UPDATE_BRANDBAR_SUBTITLE,
      payload: {
        data: {
          title: 'Profiler'
        }
      },

    });

    this.subscribeFeatureToggles();

    this.activatedRoute.params.subscribe(params => {
      this.contextId = params['contextId'];

      this.store.dispatch({
        type: PROFILER_ACTIONS.SET_CONTEXT_ID,
        payload: {
          data: this.contextId
        }
      });
    });

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.PROFILER,
      state: 'contextId',
    }, (contextId) => {
      if (contextId.state === DATA_STATE.RESOLVED) {
        // updating the url only if the context id changes
        if (this.contextId !== contextId.data) {
          this.router.navigate([this.router.url.replace(this.contextId, contextId.data)]);
          this.contextId = contextId.data;
        }
        if (this.fetchContextDetails) {
          this.contextSubscription(contextId);
        }
      } else if (contextId.state === DATA_STATE.ERROR && ([400, 404].includes(contextId.message))) {
        this.dataState = DATA_STATE.INVALID;
      }
    });

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.PROFILER,
      state: 'contextDetails',
    }, (contextDetails) => {
      this.datasetsSubscription(contextDetails);
    });
  }

  private subscribeFeatureToggles() {
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
  }

  private contextSubscription(contextId) {
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_CONTEXT,
      payload: {
        pathParams: [contextId.data]
      }
    });
  }

  private datasetsSubscription(contextDetails) {
    this.dataState = contextDetails.state;
    if (contextDetails.state === DATA_STATE.RESOLVED) {

      const datasetMetadataSubscription = super.subscribe({
        store: this.store,
        feature: FEATURE.PROFILER,
        reducer: PROFILE_REDUCERS.PROFILER,
        state: 'datasetMetadata',
      }, (datasetMetadata) => {
        if (datasetMetadata.state === DATA_STATE.INITIAL) {
          this.store.dispatch({
            type: PROFILER_ACTIONS.GET_DATASET_METADATA,
            payload: {
              queryParams: { contextId: this.contextId }
            }
          });
        } else if (datasetMetadata.state === DATA_STATE.RESOLVED) {
          this.datasetMetadata = datasetMetadata.data;
          this.setDefaultLastTimePeriod();
          datasetMetadataSubscription.unsubscribe();
        }
      });



      this.fetchContextDetails = false;

      this.projectInfo = contextDetails.data;
      if (this.projectInfo.categories) {
        this.updateCategoryValue(this.projectInfo.categories);
      }
      this.originalProjectInfo = Object.assign({}, contextDetails.data);

      // TODO: this should be removed once we have a proper solution
      // hard check on innovation types to decide the context is a default one or not
      if (this.projectInfo.innovationTypes) {
        const innovationTypes = this.projectInfo.innovationTypes;

        this.isCustomInnovationDefinition = !(innovationTypes.length === 4 &&
          innovationTypes.filter(it => (Array.isArray(it) ? it : [it]).length === 1).length === 4);

      }

    } else if (contextDetails.state === DATA_STATE.ERROR) {
      if ([400, 404].includes(contextDetails.message)) {
        this.dataState = DATA_STATE.INVALID;
      } else {
        this.errorCode = contextDetails.message;
      }
    }
  }

  /**
   * sets the last period date if not present
   */
  private setDefaultLastTimePeriod() {
    if (this.projectInfo && this.projectInfo && this.projectInfo.timePeriod && this.datasetMetadata.periods) {
      if (!this.projectInfo.timePeriod.lastPeriodDate) {
        for (const period of this.datasetMetadata.periods) {
          if (period.id === this.projectInfo.timePeriod.id) {
            this.projectInfo = Object.assign({}, this.projectInfo, {
              timePeriod: Object.assign({}, this.projectInfo.timePeriod, {
                lastPeriodDate: period.lastPeriodDate
              })
            });
            break;
          }
        }
      }
    }
  }

  onRouteChange(path: string[]) {
    // if the modal is in open state then first closing it
    if (this.slideEditModal && this.slideEditModal.isOpen) {
      this.slideEditModal.closeModal();
    }


    if (path.indexOf('whats-happening') !== -1) {
      this.selectedTab = 0;
    } else if (path.indexOf('why') !== -1) {
      this.selectedTab = 1;
    } else if (path.indexOf('whats-next') !== -1) {
      this.selectedTab = 2;
    }
  }

  onSlideEditModal() {
    dataLayerPushEvent('click-edit-context', 'profiler', 'onSlideEditModal', 'profiler.component', null);
    this.editProfiler.reset();
    // enabling the apply button before opening the modal
    this.enableApplyButton(true);
    this.slideEditModal.open(() => {
      this.editProfiler.onSubmit();
    });
  }

  private updateCategoryValue(categories) {
    const selectedCategories = [];
    this.category = '';
    categories.forEach(group => {
      // if the group is empty then skipping it
      if (group.length === 0) {
        return;
      }
      if (group.length === 1) {
        selectedCategories.push(group[0].name || group[0].label);
        if (this.category.length === 0) {
          this.category = selectedCategories.toString();
        }
      } else {
        const firstEle = group[0];
        group.forEach((ele, ind) => {
          // ignoring the first index as it indicates group
          if (ind === 0) {
            return;
          }
          selectedCategories.push((firstEle.name || firstEle.label) + ' / ' + (ele.name || ele.label));
          if (this.category.length === 0) {
            this.category = (firstEle.name || firstEle.label) + ' / ' + (ele.name || ele.label);
          }
        });
      }
    });

    if (categories.length > 1) {
      this.category = `${this.category} + ${categories.length - 1}`;
      this.showToolTip = true;
    } else {
      this.showToolTip = false;
    }
    this.categoryToolTip = selectedCategories.join('\n - ');
  }

  updateMetadataDefaults(event) {
    const payload = Object.assign({}, event);
    this.projectInfo = Object.assign({}, event);

    let isDefault = this.projectInfo.innovationPeriod.id === this.originalProjectInfo.innovationPeriod.id;

    if (isDefault) {
      isDefault = this.projectInfo.innovationThreshold.id === this.originalProjectInfo.innovationThreshold.id;
    }

    if (isDefault) {
      // TODO: this should be removed once we have a proper solution
      // hard check on innovation types to decide the context is a default one or not
      const innovationTypes = this.projectInfo.innovationTypes;
      isDefault = innovationTypes.length === 4 && innovationTypes.filter(it => it.length === 1).length === 4;
      /**
      if (this.projectInfo.innovationTypes.length === this.originalProjectInfo.innovationTypes.length) {
        const commonInnovationTypes = this.originalProjectInfo.innovationTypes
          .map(type => type.id)
          .filter(id => this.projectInfo.innovationTypes
            .map(t => t.id)
            .includes(id));
        isDefault = commonInnovationTypes.length === this.originalProjectInfo.innovationTypes.length;
      } else {
        isDefault = false;
      } */
    }
    this.isCustomInnovationDefinition = !isDefault;

    if (this.projectInfo.categories) {
      this.updateCategoryValue(this.projectInfo.categories);
    }

    this.createOrUpdateContext(payload);

    // TODO: why *second subscription* on the same state
    /*super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.PROFILER,
      state: 'context',
    }, (context) => {
      if (context.state === DATA_STATE.RESOLVED) {

      }
    });*/
  }


  createOrUpdateContext(payload) {
    payload['id'] && delete payload['id'];
    const profilerContextPayload = {
      queryParams: { contextId: this.contextId },
      body: payload
    };
    this.profilerContextService.saveOrUpdate(profilerContextPayload);
  }

  enableApplyButton(flag) {
    this.disabled = !flag;
  }
}
