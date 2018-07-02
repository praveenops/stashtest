import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ImageConstant} from '../../../shared/constants/image-constant';
import {Store} from '@ngrx/store';
import {FEATURE} from '../../../features';
import {PROFILE_REDUCERS} from '../../_store/profiler-reducers';
import {PublicImage} from '../../../shared/pipes/public-image.pipe';
import {DATA_STATE} from '../../../_store/data-states';
import { RootComponent } from '../../../root.component';

@Component({
  selector: 'ion-item-pictures',
  templateUrl: './item-pictures.component.html',
  styleUrls: ['./item-pictures.component.scss']
})
export class ItemPicturesComponent extends RootComponent implements OnInit, OnChanges, OnDestroy {

  @Input() nanKey: any;
  @Input() country: any;
  showAllImages: boolean;
  itemPictures: any = [];
  carouselImages = [];
  defaultImage = '';

  errorMessage = 'Images failed to load. Please refresh your page.';
  maxImages = 8;
  dataState: string = DATA_STATE.INITIAL;
  errorCode: any;
  picturesEmptyMessage: string;

  constructor(
    private store: Store<any>,
    private publicImage: PublicImage,
    private cd: ChangeDetectorRef, // TODO: refactor
  ) {
    super();
    this.defaultImage = ImageConstant.DEFAULT_PICTURE_IMAGE;
  }

  ngOnInit() {
    this.itemPictures = [];
    this.carouselImages = [];
    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.ITEM_DETAILS,
      state: 'itemPictures',
    }, (itemPictures) => {
      this.dataState = itemPictures.state;

      if (this.dataState === DATA_STATE.RESOLVED) {
        this.processImages(itemPictures.data);
      } else if (this.dataState === DATA_STATE.EMPTY) {
        this.picturesEmptyMessage = itemPictures.message;
      } else if (this.dataState === DATA_STATE.ERROR) {
        this.errorCode = itemPictures.message;
      }
    });
  }

  ngOnChanges(changes: any) {
    if (changes['nanKey']) {
      this.itemPictures = [];
      this.carouselImages = [];
      this.cd.detectChanges();
    }
  }
  processImages(data) {
    const imagesData = [...data];
    if (!data.length) {
      this.errorMessage = 'Images not available for this item.';
      return;
    }
    // sorting images
    // Images with the vignette flag should be on top
    // images should be sorted closer to the current date
    imagesData.sort((a, b) => {
      if (a.img_is_vignette === 'Y' && b.img_is_vignette !== 'Y') {
        return -1;
      }
      if (a.img_is_vignette !== 'Y' && b.img_is_vignette === 'Y') {
        return 1;
      }
      return new Date(b.img_crt_date).getTime() - new Date(a.img_crt_date).getTime();
    });

    this.itemPictures = imagesData.slice(0, this.maxImages);
    this.carouselImages = this.itemPictures.map(item => this.publicImage.transform(item.img_URL));
  }
}
