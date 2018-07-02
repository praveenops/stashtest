import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { PROFILER_ACTIONS } from '../profiler-actions';
import { HttpClient } from '@angular/common/http';
import { HttpMethod, RootEffect } from '../../../_store/effects/root-effect';
import { ENDPOINT } from '../../../shared/constants/endpoints';

@Injectable()
export class InnovationItemsEffects extends RootEffect {

  constructor(
    action$: Actions,
    httpClient: HttpClient
  ) {
    super(action$, httpClient);
  }

  @Effect() metadata = super.effect({
    action: PROFILER_ACTIONS.GET_INNOVATION_ITEMS,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.ITEMS,
  });

  @Effect() itemDetails = super.effect({
    action: PROFILER_ACTIONS.GET_ITEM_DETAILS,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.ITEM_DETAILS,
  });

  @Effect() itemPictures = super.effect({
    action: PROFILER_ACTIONS.GET_ITEM_PICTURES,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.ITEM_PICTURES,
  });

  @Effect() itemChars = super.effect({
    action: PROFILER_ACTIONS.GET_ITEM_CHARACTERISTICS,
    type: HttpMethod.GET,
    endpoint: ENDPOINT.ITEM_CHARS,
  });
}
