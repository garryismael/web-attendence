import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  standalone: true,
  name: 'date',
})
export class DateFormat implements PipeTransform {
  transform(value: string): string {
    return moment(value).format("MM-DD-YYYY hh:mm A");
  }
}
