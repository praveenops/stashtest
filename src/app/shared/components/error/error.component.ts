import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'ion-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  @Input() errorCode;
  @Input() errorMessage: string;
  @Input() actions: Array<string> = [];
  @Input() action;
  @Output() onAction = new EventEmitter<string>();

  emptyError = false;

  constructor() { }

  ngOnInit() {
    // if both 'action' and 'actions' attrs found then giving priority to actions
    if (!this.actions || this.actions.length === 0) {
      if (this.action) {
        this.actions = [this.action];
      } else {
        this.actions = [];
      }
    }

    this.displayMessage();
  }

  displayMessage() {
    if (this.errorMessage) {
      this.emptyError = true;
    } else {
      switch (this.errorCode) {
        // To be discussed with Gilles.

        // case 504:
        // this.errorMessage = 'It seems like network is slow please refresh your page or try again later.';
        // break;

        // case 404:
        // this.errorMessage = 'Unfortunately requested data could not be resolved, Please contact Nielsen service desk.';
        // break;

        // case 500:
        // this.errorMessage = 'It seems like server is not responding correctly, Please contact Nielsen service desk.';
        // break;

        // case 401:
        // this.errorMessage = 'User is not authorized to view this page, Please contact Nielsen service desk to get permissions.';
        // break;

        default:
          this.errorMessage = 'Unable to connect to Nielsen.'
            + ' Refresh your page or contact your Nielsen representative if the problem persists.';
          break;
      }
    }
  }

  onActionClicked(action) {
    this.onAction.emit(action);
  }
}
