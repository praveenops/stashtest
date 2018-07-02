import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ion-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  title = 'Nielsen Data is Currently Unavailable';
  description = `
    Please contact your Nielsen representative or email
    <br>
    <a class="c-pointer" href="mailto:nielseninnovationsupport@nielsen.com"> nielsenInnovationsupport@nielsen.com</a>
  `;

  /**
   * This method is initialize error Page content.
   * @param
   * @return
   */
  ngOnInit() {
  }
}
