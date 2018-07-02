import { Action } from '@ngrx/store';
import { Payload } from './payload';

export interface CustomAction extends Action {
  payload?: Payload;
}
