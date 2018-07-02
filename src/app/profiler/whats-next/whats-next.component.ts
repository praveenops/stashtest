import { Component, OnInit } from '@angular/core';
import { RootComponent } from '../../root.component';

@Component({
  selector: 'ion-whats-next',
  templateUrl: './whats-next.component.html',
  styleUrls: ['./whats-next.component.scss']
})
export class WhatsNextComponent extends RootComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
