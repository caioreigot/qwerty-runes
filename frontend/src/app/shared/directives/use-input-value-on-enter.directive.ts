import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[useInputValueOnEnter]' })
export class UseInputValueOnEnterDirective {

  @Input() useInputValueOnEnter: ((value: string) => void) | null = null;

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement as HTMLInputElement;
    
    element.onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!this.useInputValueOnEnter) return;
        this.useInputValueOnEnter(element.value);
        element.value = '';
      }
    }
  }
}
