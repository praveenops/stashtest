import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToTimestamp'
})
export class DateToTimestampPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const pattern = new RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}');
    return (value && pattern.exec(value.trim())) ? value.replace(' ', 'T') + 'Z' : value;
  }
}
