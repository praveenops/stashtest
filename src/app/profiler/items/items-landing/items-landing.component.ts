import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FEATURE } from '../../../features';
import { PROFILER_ACTIONS } from '../../_store/profiler-actions';
import { PROFILE_REDUCERS } from '../../_store/profiler-reducers';
import { DATA_STATE } from '../../../_store/data-states';
import { Utils } from '../../../shared/utils/utils';
import { ProfilerRootComponent } from '../../profiler-root-component';
import { ProfilerContextService } from '../../profiler-context-service';
import { take } from 'rxjs/internal/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ion-items-landing',
  templateUrl: './items-landing.component.html',
  styleUrls: ['./items-landing.component.scss']
})
export class ItemsLandingComponent extends ProfilerRootComponent implements OnInit, OnDestroy {

  currentView = 'items';
  slideLeft = false;
  dataSet: any;
  dataSetId: string;
  paramId: string;
  contextId: number;
  noResultMessage: string;

  selectedItem: any;
  items: any[] = [];
  type: string;
  routeSubscription: Subscription;
  errorCode: any;

  factType: string;
  currency: string;

  // these types only will be cehcked from empty condition
  readonly EMPTY_CHECKABLE_TYPES = ['CAT', 'MFR', 'BRD', 'SBD'];

  constructor(
    store: Store<any>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    profilerContextService: ProfilerContextService
  ) {
    super(store, profilerContextService);
  }

  ngOnInit() {
    super.ngOnInit();

    // initializing with default state
    this.noResultMessage = 'YOUR SELECTIONS RETURN NO RESULTS.';

    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.paramId = params['id'].substring(3);
        this.type = params['id'].substring(0, 3);
        if (this.dataSet) {
          this.getInnovationItems();
        }
      }
    });

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.ITEMS,
      state: 'innovationItems',
    }, (innovationItems) => {
      this.innovationItemsSubscription(innovationItems);
    });

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.PROFILER,
      state: 'contextId',
    }, (contextId) => {
      if (contextId.state === DATA_STATE.RESOLVING) {
        // whenever context is changing setting the view
        this.selectedItem = null;
        this.showPanel('items');
        this.dataState = DATA_STATE.RESOLVING;
      } else if (contextId.state === DATA_STATE.RESOLVED) {
        this.profilerContextSubscription(contextId);
      }
    });

  }

  handleData(datasets, profilerContext) {
    if (profilerContext.state === DATA_STATE.RESOLVING) {
      // whenever context is changing setting the view
      this.showPanel('items');
      this.dataState = DATA_STATE.RESOLVING;
    }

    if (datasets.state === DATA_STATE.RESOLVED && [DATA_STATE.INITIAL, DATA_STATE.EMPTY].includes(profilerContext.state)) {
      this.datasetsSubscription(datasets);
    } else if (datasets.state === DATA_STATE.RESOLVED && profilerContext.state === DATA_STATE.RESOLVED) {
      this.dataSetId = datasets.data.datasetId;
      this.profilerContextSubscription(profilerContext);
    }
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    super.ngOnDestroy();
  }

  private innovationItemsSubscription(innovationItems) {
    this.dataState = innovationItems.state;

    if (innovationItems.state === DATA_STATE.RESOLVED) {

      this.factType = innovationItems.data.factType;
      this.currency = innovationItems.data.currency;

      this.items = innovationItems.data.items && innovationItems.data.items.map(d => ({
        ...d,
        innovationSales: d.innovationSales.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        name: Utils.trim(d.name) // triming name because it may contain extra spaces
      }));

      if (this.items && this.items.length === 0) {
        this.dataState = DATA_STATE.EMPTY;
      }

    } else if (innovationItems.state === DATA_STATE.ERROR) {
      this.errorCode = innovationItems.message;
    }
  }

  private datasetsSubscription(datasets) {
    if (datasets.state === DATA_STATE.RESOLVED) {
      const data = datasets.data;
      this.dataSet = data;
      this.dataSetId = data.datasetId;
      if (data.defaults) {
        const factContext = data.defaults.factContext;
        factContext.manufacturerBrands = data.defaults.factContext.manufacturers.filter(o => o.id === this.paramId);
        this.getInnovationItems();
      }
    }
  }

  private profilerContextSubscription(contextId) {
    this.dataState = DATA_STATE.RESOLVING;
    if (contextId.state === DATA_STATE.RESOLVED) {
      this.contextId = contextId.data;
      this.store
        .pipe(
          select(FEATURE.PROFILER),
          select(PROFILE_REDUCERS.PROFILER),
          select('contextId'),
          take(1)
        )
        .subscribe(s => {
          if (s.state === DATA_STATE.RESOLVED) {
            // assuming the current item is removed by default
            let itemRemoved = true;
            const subs = super.subscribe({
              store: this.store,
              feature: FEATURE.PROFILER,
              reducer: PROFILE_REDUCERS.PROFILER,
              state: 'contextDetails',
            }, (contextDetails) => {
              if (contextDetails.state === DATA_STATE.RESOLVED) {
                // type should be one of empty checkable type
                if (this.type in this.EMPTY_CHECKABLE_TYPES) {
                  const contextManufacturers = contextDetails.data.json.manufacturers;
                  contextManufacturers.forEach(e => {
                    if (!this.paramId || this.paramId === (e.id ? e.id : e.value)) {
                      itemRemoved = false;
                    }
                  });
                } else {
                  itemRemoved = false;
                }
                if (itemRemoved) {
                  this.dataState = DATA_STATE.EMPTY;
                } else {
                  this.getInnovationItems();
                }
              }
            });

            subs.unsubscribe();
          }
        });
    }
  }

  getInnovationItems() {
    const queryParams: any = {
      type: this.type,
    };
    if (this.type !== 'CAT' && this.paramId) {
      queryParams.id = this.paramId;
    }
    if (this.contextId) {
      queryParams.contextId = this.contextId;
    }
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_INNOVATION_ITEMS,
      payload: {
        queryParams
      }
    });
  }

  showPanel(panel) {
    this.slideLeft = (panel === 'item-details');
    this.currentView = panel;
  }

  close() {
    // going back to parent route
    this.router.navigate([`../../`], { relativeTo: this.activatedRoute });
  }

  back() {
    this.selectedItem = null;
    this.showPanel('items');
  }

  showItemDetails(item) {
    if (!item || this.selectedItem === item) {
      this.selectedItem = null;
      this.showPanel('items');
    } else {
      this.selectedItem = item;
      this.showPanel('item-details');
    }
  }
}
