import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '../../../shared/constants/endpoints';
import { PROFILER_ACTIONS } from '../profiler-actions';
import { HttpMethod, RootEffect } from '../../../_store/effects/root-effect';

@Injectable()
export class ProfilerEffects extends RootEffect {

  constructor(
    action$: Actions,
    httpClient: HttpClient
  ) {
    super(action$, httpClient);
  }

  @Effect() upsertContext = super.effect({
    action: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT,
    type: HttpMethod.POST,
    endpoint: ENDPOINT.UPSERT_CONTEXT,
  });

  @Effect() metadata = super.effect({
    action: PROFILER_ACTIONS.GET_DATASET_METADATA,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.DATASET_METADATA,
  });


  @Effect() items = super.effect({
    action: PROFILER_ACTIONS.GET_CONTEXT,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.GET_CONTEXT,
  });
}
