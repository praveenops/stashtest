import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'ion-help-message',
  templateUrl: 'help-message.component.html',
  styleUrls: ['help-message.component.scss']
})

export class HelpMessageComponent {
  @Input() icon: string;
  @Input() primaryMessage: string;
  @Input() secondaryMessage: string;
  @Input() description: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  navigateTo(event) {
    this.change.emit(event);
  }
}
