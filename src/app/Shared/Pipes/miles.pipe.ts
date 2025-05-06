import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'miles'
})
export class MilesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
