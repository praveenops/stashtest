import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { APP_ACTIONS } from '../app-actions';
import { ENDPOINT } from '../../shared/constants/endpoints';
import { RootEffect, HttpMethod } from './root-effect';

@Injectable()
export class AppEffects extends RootEffect {

  constructor(
    action$: Actions,
    httpClient: HttpClient
  ) {
    super(action$, httpClient);
  }

  @Effect() featureToggles = super.effect({
    action: APP_ACTIONS.GET_FEATURE_TOGGLES,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.FEATURE_TOGGLES,
  });
}
