import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toShortTime'
})
export class ToShortTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (moment(value, 'YYYY-MM-DD HH:mm:ss').isValid()) {
      const shortTime = `${moment(value).format('HH:mm')}`;
      return shortTime;
    } else {
      return '-';
    }
  }

}
