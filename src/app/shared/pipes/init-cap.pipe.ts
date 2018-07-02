import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts the string to Init Cap Case
 * Ex: 'CAMEL CASE' ==> 'Camel Case'
 *     'type script' ==> 'Type Script'
 */
@Pipe({ name: 'initcaps' })
export class InitcapsPipe implements PipeTransform {

  /**
   *
   * @param {string} value
   * @returns {string}
   */
  transform(value: string): any {
    if (value) {
      value = value.toLowerCase();
      let tokens: string[] = value.split(' ');
      tokens = tokens.map(this.initCap);
      return tokens.join(' ');
    }
    return value;
  }

  private initCap(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
