import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ion-time-period',
  templateUrl: './time-period.component.html',
  styleUrls: ['./time-period.component.scss']
})
export class TimePeriodComponent implements OnInit {

  @Input() timePeriodData: any;
  @Input() defaultTimePeriod: any;
  @Output() timePeriodChange: EventEmitter<any> = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  onChange(event) {
    const val = event.target.selected;
    this.timePeriodChange.emit(val);
  }
}
