import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { DASHBOARD_ACTIONS } from '../dashboard-actions';
import { HttpClient } from '@angular/common/http';
import { ENDPOINT } from '../../../shared/constants/endpoints';
import { HttpMethod, RootEffect } from '../../../_store/effects/root-effect';

@Injectable()
export class UserPreferencesEffects extends RootEffect {

  constructor(
    action$: Actions,
    httpClient: HttpClient
  ) {
    super(action$, httpClient);
  }

  @Effect() userPreference = super.effect({
    action: DASHBOARD_ACTIONS.FETCH_USER_PREFERENCE,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.FETCH_USER_PREFERENCE
  });

  @Effect() saveUserPreference = super.effect({
    action: DASHBOARD_ACTIONS.SAVE_USER_PREFERENCE,
    type: HttpMethod.POST,
    endpoint: ENDPOINT.SAVE_USER_PREFERENCE
  });
}
