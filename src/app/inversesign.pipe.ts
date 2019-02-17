import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inverseSign'
})
export class InverseSignPipe implements PipeTransform {

  transform(value: any, args?: any): number {
    if (value === 0) {
      return value;
    } else if (value > 0) {
      return value * -1;
    } else {
      return value * -1;
    }
  }
}
