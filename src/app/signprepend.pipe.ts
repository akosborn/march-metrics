import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signPrepend'
})
export class SignPrependPipe implements PipeTransform {

  transform(value: any, args?: any): string {
    if (value > 0) {
      return '+' + value;
    } else {
      return value;
    }
  }
}
