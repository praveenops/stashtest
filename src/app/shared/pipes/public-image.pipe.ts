import {Pipe, PipeTransform} from '@angular/core';
import {ENDPOINT} from '../constants/endpoints';
import {environment} from '../../../environments/environment';

@Pipe({name: 'publicImage'})
export class PublicImage implements PipeTransform {

  /**
   *
   * @param {string} value
   * @returns {any}
   */
  transform(value: string): any {
    return `${environment.apiUrlPrefix}${ENDPOINT.ITEM_PUBLIC_IMAGE}?target=${encodeURIComponent(value)}`;
  }
}
