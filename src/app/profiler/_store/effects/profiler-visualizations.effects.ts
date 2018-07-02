import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { PROFILER_ACTIONS } from '../profiler-actions';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '../../../shared/constants/endpoints';
import { HttpMethod, RootEffect } from '../../../_store/effects/root-effect';

@Injectable()
export class ProfilerVisualizationsEffects extends RootEffect {

  constructor(
    action$: Actions,
    httpClient: HttpClient
  ) {
    super(action$, httpClient);
  }

  @Effect() marketshare = super.effect({
    action: PROFILER_ACTIONS.GET_MARKET_SHARE,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.MARKET_SHARE,
  });

  @Effect() innovationtype = super.effect({
    action: PROFILER_ACTIONS.GET_INNOVATION_TYPE,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.INNOVATION_TYPE,
  });

  @Effect() lxSubTypes = super.effect({
    action: PROFILER_ACTIONS.GET_LX_SUBTYPES,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.LX_SUBTYPES,
  });

  @Effect() innvationCharacteristics = super.effect({
    action: PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.INNOVATION_CHARACTERISTICS,
  });
}
