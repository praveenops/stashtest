import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ItemPicturesComponent } from './item-pictures.component';
import { UnitTestingModule } from '../../../unit-testing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LANDING_PAGE_MOCK } from '../../../shared/mockdata/landing.page.mockdata';
import { PublicImage } from '../../../shared/pipes/public-image.pipe';
import { profilerReducers } from '../../_store/profiler-reducers';
import { StoreModule } from '@ngrx/store';
import { FEATURE } from '../../../features';
import { RootComponent } from '../../../root.component';
import { DATA_STATE } from '../../../_store/data-states';

describe('ItemPicturesComponent', () => {
  let component: ItemPicturesComponent;
  let fixture: ComponentFixture<ItemPicturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPicturesComponent],
      imports: [UnitTestingModule, SharedModule, StoreModule.forFeature(FEATURE.PROFILER, profilerReducers)],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [PublicImage]
    })
      .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ItemPicturesComponent);
    component = fixture.componentInstance;
    spyOn(RootComponent.prototype, 'subscribe');
    spyOn(component, 'ngOnChanges');
    component.dataState = DATA_STATE.RESOLVED;
    component.processImages(LANDING_PAGE_MOCK.imageDetails.slice(0));
    fixture.detectChanges();
    tick(1000);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('No of thumbnail image should be equal to carousel images', () => {

    expect(component.carouselImages.length).toBe(component.itemPictures.length);
  });
  it('', () => {
    component.processImages(LANDING_PAGE_MOCK.imageDetails);
    expect(component.carouselImages.length).toBe(component.itemPictures.length);
  });

  it('Should show only 3 images without plus sign', () => {
    component.processImages(LANDING_PAGE_MOCK.imageDetails.slice(3));
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.innerHTML).not.toContain('+ 3');
    expect((fixture.elementRef.nativeElement.innerHTML.match(/<ion-image/g) || []).length).toBe(3);
  });

  it('Should not show + when total images are 4', () => {
    component.processImages(LANDING_PAGE_MOCK.imageDetails.slice(2));
    fixture.detectChanges();
    expect((fixture.elementRef.nativeElement.innerHTML.match(/<ion-image/g) || []).length).toBe(4);
  });

  it('Should show only 3 images out of 6', () => {
    component.processImages(LANDING_PAGE_MOCK.imageDetails);
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.innerHTML).toContain('+ 3');
    expect((fixture.elementRef.nativeElement.innerHTML.match(/<ion-image/g) || []).length).toBe(3);
  });

  it('Images should be sorted', () => {
    component.processImages(LANDING_PAGE_MOCK.imageDetails);
    expect(component.itemPictures[0].id).toBe(2);
    expect(component.itemPictures[1].id).toBe(3);
    expect(component.itemPictures[2].id).toBe(1);
    expect(component.itemPictures[3].id).toBe(5);
    expect(component.itemPictures[4].id).toBe(4);
    expect(component.itemPictures[5].id).toBe(6);
  });

  it('Should show error message if there are zero images', fakeAsync(() => {
    component.dataState = DATA_STATE.EMPTY;
    component.processImages([]);
    fixture.detectChanges();
    tick(1000);
    const errorElement = fixture.nativeElement.querySelector('ion-error');
    expect(errorElement).toBeTruthy();
  }));

  describe(`Check all views based on state`, () => {

    it(`should verify the spinner screen while loading the view`, fakeAsync(() => {
      component.dataState = DATA_STATE.RESOLVING;
      fixture.detectChanges();
      tick(1000);
      const element = fixture.nativeElement.querySelector('.spinner-container');
      expect(element).toBeTruthy();
    }));

    it(`should verify the error screen if error occurs`, fakeAsync(() => {
      component.dataState = DATA_STATE.ERROR;
      fixture.detectChanges();
      tick(100);
      const element = fixture.nativeElement.querySelector('ion-error');
      expect(element).toBeTruthy();
    }));

    it(`should verify the view when data is resolved`, fakeAsync(() => {
      const data = [
        {
          'img_URL': 'http://mue2rhegrdq000000.uhzxxl1l01qenjl3xtee54wyge.cx.internal.cloudapp.net:9090/RDaaS/e2e/v1/'
           + 'image/processImageUrl/38007EC679C94C097E509E94F9C8BA6CB811B2C63070583A50E6B21882FD0665',
          'img_Thumbnail_URL': 'http://mue2rhegrdq000000.uhzxxl1l01qenjl3xtee54wyge.cx.internal.cloudapp.net:9090/'
          + 'RDaaS/e2e/v1/image/processImageUrl/4C033B854A3ECD484A18F4744603E7F595E45DFAC68B2EA277BF779B104B3BDC',
          'img_is_vignette': 'N',
          'img_crt_date': '2015-03-05T01:15:08+01:00',
        }
      ];
      component.dataState = DATA_STATE.RESOLVED;
      component['processImages'](data);
      tick(1000);
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('.pictures-container');
      expect(element).toBeTruthy();
    }));
  });
});
