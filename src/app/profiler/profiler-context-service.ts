import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FEATURE } from '../features';
import { DATA_STATE } from '../_store/data-states';
import { PROFILE_REDUCERS } from './_store/profiler-reducers';
import { PROFILER_ACTIONS } from './_store/profiler-actions';
import { take } from 'rxjs/internal/operators';

@Injectable()
export class ProfilerContextService {

    private context: any;

    constructor(private store: Store<any>) {
    }

    retryContext() {
        if (!this.context) {
            // TODO: this nested subscription should be removed
            // once we merge the contextId and contextDetails to single object
            this.store
              .pipe(
                select(FEATURE.PROFILER),
                select(PROFILE_REDUCERS.PROFILER),
                select('contextDetails'),
                take(1)
              ).subscribe(contextDetails => {
                    if (contextDetails.state === DATA_STATE.RESOLVED) {
                        this.context = { body: contextDetails.data.json };

                        this.store
                          .pipe(
                            select(FEATURE.PROFILER),
                            select(PROFILE_REDUCERS.PROFILER),
                            select('contextId'),
                            take(1)
                          ).subscribe(contextId => {
                                if (contextId.state === DATA_STATE.RESOLVED) {
                                    this.context.queryParams = { contextId: contextId.data };
                                    this.saveOrUpdate(this.context);
                                }
                            });
                    }
                });
        } else {
            this.saveOrUpdate(this.context);
        }
    }

    saveOrUpdate(payload) {
        this.context = payload;
        this.store.dispatch({
            type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT,
            payload
        });
    }
}
