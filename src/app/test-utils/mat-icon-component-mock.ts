import { Component, Input } from '@angular/core';

@Component({
  selector: 'mat-icon',
  template: '<span></span>'
})
export class MatIconComponentMock {
  @Input() svgIcon: any;
  @Input() fontSet: any;
  @Input() fontIcon: any;
  @Input() color: any;
}
