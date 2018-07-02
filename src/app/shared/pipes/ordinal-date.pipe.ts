import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ordinalDate' })
export class OrdinalDate implements PipeTransform {
  private MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  private SUPPORTED_FORMATS = ['monthFirst', 'dayFirst'];

  /**
   *
   * @param {string} value
   * @returns {any}
   */
  transform(value: string, format = 'monthFirst'): any {
    if (!value) {
      return value;
    }
    if (this.SUPPORTED_FORMATS.indexOf(format) !== -1) {
      return this.getFormattedDate(value, format);
    }
  }

  /**
   * @param givenDate date given in the format "2017-02-18 00:00:00"
   * @returns return date in format "February 18th 2017" for "monthFirst" format
   * and "18 February 2017" for "dayFirst" format
   */
  public getFormattedDate(givenDate: string, format: string) {
    try {
      const datePart = givenDate.split(' ')[0];
      const tokens = datePart.split('-');
      switch (format) {
        case 'monthFirst':
          return `${this.MONTHS[parseInt(tokens[1], 10) - 1]} ${this.dateOrdinal(parseInt(tokens[2], 10))} ${tokens[0]}`;
        case 'dayFirst':
          const day = parseInt(tokens[2], 10);
          return `${day > 9 ? '' : '0'}${day} ${this.MONTHS[parseInt(tokens[1], 10) - 1]} ${tokens[0]}`;
      }
      return;
    } catch (e) {
      console.log('Couldn\'t convert the date');
    }
    return 'N/A';
  }

  public dateOrdinal(d) {
    return d + (31 === d || 21 === d || 1 === d ? 'st' : 22 === d || 2 === d ? 'nd' : 23 === d || 3 === d ? 'rd' : 'th');
  }

}
