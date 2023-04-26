import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCard'
})
export class CreditCardPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {

    var res: string = "";

    // Remove chars if to long, else add. It must be 16 chars!
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    else if (value.length < 16) {
      for (var i = value.length - 1; i < 16; i++) {
        value += '0';
      }
    }

    for (var i = 0; i < value.length; i++) {
      if (i % 4 === 0 && i !== 0)
        res += ' - '
      res += value[i];
    }

    return res.slice(0, 25);
  }

}
