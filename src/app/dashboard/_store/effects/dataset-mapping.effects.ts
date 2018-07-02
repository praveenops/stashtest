import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DASHBOARD_ACTIONS } from '../dashboard-actions';
import { HttpClient } from '@angular/common/http';
import { HttpMethod, RootEffect } from '../../../_store/effects/root-effect';
import { ENDPOINT } from '../../../shared/constants/endpoints';


@Injectable()
export class DataSetMappingEffects extends RootEffect {

  constructor(
    action$: Actions,
    httpClient: HttpClient,
  ) {
    super(action$, httpClient);
  }

  @Effect() metadata = super.effect({
    action: DASHBOARD_ACTIONS.FETCH_DATASETS,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.DATASETS,
  });

}
