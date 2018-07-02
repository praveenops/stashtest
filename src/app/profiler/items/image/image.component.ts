import {Component, Input, OnInit} from '@angular/core';
import {ImageConstant} from '../../../shared/constants/image-constant';

@Component({
  selector: 'ion-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() src: any;
  defaultImage = ImageConstant.DEFAULT_PICTURE_IMAGE;

  constructor() { }

  ngOnInit() { }
}
