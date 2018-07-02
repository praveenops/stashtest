import { Store } from '@ngrx/store';
import { RootComponent } from '../root.component';
import { DATA_STATE } from '../_store/data-states';
import { FEATURE } from '../features';
import { PROFILE_REDUCERS } from './_store/profiler-reducers';
import { ProfilerContextService } from './profiler-context-service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PROFILER_ACTIONS } from './_store/profiler-actions';

export class ProfilerRootComponent extends RootComponent implements OnInit {
    dataState: string = DATA_STATE.INITIAL;
    protected contextResolving: boolean;

    constructor(
        protected store: Store<any>,
        public profilerContextService: ProfilerContextService
    ) {
        super();
    }

    ngOnInit() {
        super.subscribe({
            store: this.store,
            feature: FEATURE.PROFILER,
            reducer: PROFILE_REDUCERS.PROFILER,
            state: 'contextId',
        }, (contextId) => {
            if (contextId.state === DATA_STATE.RESOLVING
                || contextId.state === DATA_STATE.ERROR) {
                this.dataState = contextId.state;
                this.setProfilerRelatedContextToInitial();
            }
            // if the context is error then setting all context related data as error
            if (contextId.state === DATA_STATE.ERROR) {
                this.setProfilerRelatedContextToError();
            }
            this.contextResolving = (contextId.state === DATA_STATE.RESOLVING);
        });
    }

    setProfilerRelatedContextToInitial() {
      this.store.dispatch({
        type: PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_RESET_TO_INITIAL
      });
      this.store.dispatch({
        type: PROFILER_ACTIONS.GET_MARKET_SHARE_RESET_TO_INITIAL
      });
      this.store.dispatch({
        type: PROFILER_ACTIONS.GET_INNOVATION_TYPE_RESET_TO_INITIAL
      });
      this.store.dispatch({
        type: PROFILER_ACTIONS.GET_LX_SUBTYPES_RESET_TO_INITIAL
      });
    }

    /**
     * This method sets the all profiler context related data to error state
     */
    setProfilerRelatedContextToError() {
        const payload = { data: {} };

        this.store.dispatch({ type: PROFILER_ACTIONS.GET_MARKET_SHARE_ERROR, payload });
        this.store.dispatch({ type: PROFILER_ACTIONS.GET_LX_SUBTYPES_ERROR, payload });
        this.store.dispatch({ type: PROFILER_ACTIONS.GET_INNOVATION_TYPE_ERROR, payload });
        this.store.dispatch({ type: PROFILER_ACTIONS.GET_INNOVATION_ITEMS_ERROR, payload });
        this.store.dispatch({ type: PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_ERROR, payload });
        this.store.dispatch({ type: PROFILER_ACTIONS.GET_ITEM_DETAILS_ERROR, payload });
    }

    refreshContext() {
        this.profilerContextService.retryContext();
    }
}
