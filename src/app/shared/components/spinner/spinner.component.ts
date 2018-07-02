import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ion-spinner',
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss']
})

export class SpinnerComponent {

  @Output() change: EventEmitter<any> = new EventEmitter();
  icon = 'ion:profiler';
  actionTitle = 'LOADING YOUR PROFILER DATA.';
  navigateTo(event) {
    this.change.emit(event);
  }
}
