import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ngModel][creditcard]',
  host: {
    '(ngModelChange)': 'onInputChange($event)',
    '(keydown.backspace)': 'onInputChange($event.target.value, true)',
  },
})
export class CreditCardDirective {

  constructor(
    //private el: ElementRef,
    private model: NgControl,
  ) { }

  //@HostListener('blur') onBlur() {
  //  let value: number = this.el.nativeElement.value * 1;
  //  this.el.nativeElement.value = value.toString();
  //  console.log('HostListener - ', value);
  //}

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event: any) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: any) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event: string, backspace: boolean) {

    var newVal = event.replace(/\D/g, '');

    if (backspace || event.length > 25)
      newVal = newVal.substring(0, newVal.length - 1);
    
    if (newVal.length == 0)
      newVal = '';

    var res: string = "";
    for (var i = 0; i < newVal.length; i++) {
      if (i % 4 === 0 && i !== 0)
        res += ' - '
      res += newVal[i];
    }

    this.model.valueAccessor?.writeValue(res);
    //this.model.control?.setValue(res);
  }

}
