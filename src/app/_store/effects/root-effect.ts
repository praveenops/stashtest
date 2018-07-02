import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ENDPOINT } from '../../shared/constants/endpoints';
import { CustomAction } from '../custom-action';
import { of, merge } from 'rxjs';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export interface EffectConfig {
  action: string;
  type: HttpMethod;
  endpoint: string;
}

export abstract class RootEffect {

  constructor(
    protected action$: Actions,
    protected httpClient: HttpClient,
  ) {}

  public effect(effectConfig: EffectConfig) {
    return this.action$
      .ofType(effectConfig.action)
      .pipe(
        switchMap((action: CustomAction) => {
          return merge(
            of({
              type: `${effectConfig.action}_RESOLVING`
            }),
            this.getApiSubscription(action, effectConfig),
          );
      }));
  }

  private getApiSubscription(action, effectConfig) {
    const endpoint = ENDPOINT.get(
      effectConfig.endpoint,
      action.payload && action.payload.pathParams
    );
    let params: any = action.payload && action.payload.queryParams;

    // Making sure contextId is not forwarded as null, else results in 400
    if (params && params.contextId === null) {
      params = '';
    }

    const body = action.payload && action.payload.body;
    let httpReqParams;
    if (effectConfig.type === HttpMethod.GET ) {
      httpReqParams = [endpoint, { params }];
    } else {
      httpReqParams = [endpoint, body, { params }];
    }

    return this.httpClient[effectConfig.type](...httpReqParams)
      .pipe(
        map(res => {
          if (!res) {
            return {
              type: `${effectConfig.action}_EMPTY`,
              payload: {
                data: res,
              }
            };
          }
          return {
            type: `${effectConfig.action}_RESOLVED`,
            payload: {
              data: res,
            }
          };
        }),
        catchError(error => of({
          type: `${effectConfig.action}_ERROR`,
          payload: {
            data: error,
          }
        }))
      );
  }
}
