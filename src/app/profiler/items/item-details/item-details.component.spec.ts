import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ItemDetailsComponent } from './item-details.component';
import { UnitTestingModule } from '../../../unit-testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { LANDING_PAGE_MOCK } from '../../../shared/mockdata/landing.page.mockdata';
import { SharedModule } from '../../../shared/shared.module';
import { Store } from '@ngrx/store';
import { ArrayUtils } from '../../../shared/utils/array-utils';
import { DATA_STATE } from '../../../_store/data-states';
import { RootComponent } from '../../../root.component';
import { By } from '@angular/platform-browser';

describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {

    const arrayUtilsStub = {
      sortArrayWithGivenOrder() {
      }
    };

    TestBed.configureTestingModule({
      declarations: [ItemDetailsComponent],
      imports: [UnitTestingModule, SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: ArrayUtils, useValue: arrayUtilsStub }]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component['store'] = fixture.debugElement.injector.get(Store);
    spyOn(RootComponent.prototype, 'subscribe');
    spyOn(component, 'virtualPageView');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  /**
   * what's new section
   */

  it('Should display appropriate text when innovation type is New Brand', () => {
    const data = LANDING_PAGE_MOCK.itemInnovationDetails;
    data.innovationType = 'NEW BRAND';
    component.processInnovationDetails(data);
    expect(component.subTypeClassification).toBe('Bic is a new brand in Great Britain');
    expect(component.subTypeDrivingChars.length).toBe(0);
  });

  it('Should display appropriate text when innovation type is Brand Extension', () => {
    const data = LANDING_PAGE_MOCK.itemInnovationDetails;
    data.innovationType = 'BRAND EXTENSION';
    component.processInnovationDetails(data);
    expect(component.subTypeClassification).toBe('The Bic has extended to the Shampoo & Conditioners category in Great Britain');
    expect(component.subTypeDrivingChars.length).toBe(0);
  });

  it('Should display appropriate text when innovation type is New Sub-brand', () => {
    const data = LANDING_PAGE_MOCK.itemInnovationDetails;
    data.innovationType = 'NEW SUB-BRAND';
    component.processInnovationDetails(data);
    expect(component.subTypeClassification).toBe('Bic Hybrid is a new sub-brand for Bic in Great Britain');
    expect(component.subTypeDrivingChars.length).toBe(0);
  });

  it('Should display appropriate text when innovation type is Special Collection or Minor change Offering', () => {
    const data = LANDING_PAGE_MOCK.itemInnovationDetails;
    data.innovationType = 'SPECIAL COLLECTION';
    component.processInnovationDetails(data);
    expect(component.subTypeClassification).toBeUndefined();
    expect(component.subTypeDrivingChars.length).toBe(2);
    expect(component.subTypeDrivingChars[0].subType).toBe('SIZE');
    expect(component.subTypeDrivingChars[0].drivingChars.map(e => e.value)).toEqual(['12', '6']);
  });

  describe('When Innovation Type is "Line Extension"', () => {
    let itemInnovationDetails;
    beforeEach(fakeAsync(() => {
      itemInnovationDetails = JSON.parse(JSON.stringify(LANDING_PAGE_MOCK.itemInnovationDetails));
      itemInnovationDetails.innovationType = 'LINE EXTENSION';

      component.item = LANDING_PAGE_MOCK.itemsList[0];
      component.charDetails = LANDING_PAGE_MOCK.itemCharacteristics;
      component.itemInnovationDetails = itemInnovationDetails;

      component.dataState = DATA_STATE.RESOLVED;
      component.charState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      tick(100);
    }));

    it('Should display appropriate text when innovation subtype not equals Novel Combination', () => {
      component.processInnovationDetails(itemInnovationDetails);
      expect(component.subTypeClassification).toBeUndefined();
      expect(component.subTypeDrivingChars.length).toBe(2);
      expect(component.subTypeDrivingChars[0].subType).toBe('SIZE');
      expect(component.subTypeDrivingChars[0].drivingChars.map(e => e.value)).toEqual(['12', '6']);
    });

    it('Should display appropriate text when innovation subtype is Novel Combination', () => {
      itemInnovationDetails.innovationSubtypeDetails[0].innovationSubtype = 'NOVEL COMBINATION';
      component.processInnovationDetails(itemInnovationDetails);
      expect(component.subTypeDrivingChars.length).toBe(0);
      expect(component.subTypeClassification)
        .toBe('Item represents a new combination of existing characteristic values for the Bic Hybrid sub-brand');
    });

    it('Should display appropriate badges (LOI) next to the characteristics values ', () => {
      component.processInnovationDetails(itemInnovationDetails);
      fixture.detectChanges();
      expect(component.subTypeDrivingChars[0].drivingChars[0].innovationClass).toEqual('primary');
      expect(component.subTypeDrivingChars[0].drivingChars[1].innovationClass).toEqual('secondary');

      expect(component.subTypeDrivingChars[1].drivingChars[0].innovationClass).toEqual('accent');
      expect(component.subTypeDrivingChars[1].drivingChars[1].innovationClass).toEqual('');
    });

    it('Should not display badges (LOI) for "Product Variant Claim char under Subline"', () => {
      itemInnovationDetails.innovationSubtypeDetails[0].innovationSubtype = 'SUBLINE';
      itemInnovationDetails.innovationSubtypeDetails[0].drivingChars[1].charDescription = 'GLOBAL PRODUCT VARIANT CLAIM';
      component.processInnovationDetails(itemInnovationDetails);
      fixture.detectChanges();
      expect(component.subTypeDrivingChars[1].drivingChars[0].innovationClass).toEqual('');
    });

    it('Should verify that "LOI" is taken from the "innovationLevel" property from the API reponse', () => {
      component.processInnovationDetails(itemInnovationDetails);
      fixture.detectChanges();
      expect(component.subTypeDrivingChars[0].drivingChars[0].innovationLevel)
      .toBe(itemInnovationDetails.innovationSubtypeDetails[1].drivingChars[1].innovationLevel);
    });
  });

  describe('item characteristics', () => {

    beforeEach(fakeAsync(() => {

      const data = LANDING_PAGE_MOCK.itemCharacteristics;
      const item = LANDING_PAGE_MOCK.itemsList[0];
      const itemInnovationDetails = LANDING_PAGE_MOCK.itemInnovationDetails;

      component.item = item;
      component.charDetails = data;
      component.itemInnovationDetails = itemInnovationDetails;
      component.dataState = DATA_STATE.RESOLVED;
      component.charState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
    }));

    it('should create', () => {
      const element = fixture.nativeElement;
      expect(element).toBeTruthy();
    });

    it('should not display characteristics by default', fakeAsync(() => {

      const element = fixture.nativeElement;
      expect(component.hideCharacteristics).toBe(true);
      expect(element.querySelector('.chars-container').innerText).toContain('VIEW ALL CHARACTERISTICS');
    }));

    it('Should collect innovation sub types in order and display', fakeAsync(() => {
      const subTypes = component.collectInnovationSubTypes(LANDING_PAGE_MOCK.itemInnovationDetails.innovationSubtypeDetails);
      expect(subTypes).toBe('SIZE, FORM');
    }));

    it('should display domain in expanded form on click of `VIEW ALL CHARACTERISTICS`', () => {
      component.hideCharacteristics = false;
      fixture.detectChanges();
      const element = fixture.nativeElement;

      expect(element.querySelector('.item-characteristics-header').querySelectorAll('span')[0].hidden).toBe(true);
      expect(element.querySelector('.item-characteristics-header').querySelectorAll('span')[1].hidden).toBe(false);
    });

    it('should display domain name', () => {
      component.hideCharacteristics = false;
      component.charState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      const element = fixture.nativeElement;

      expect(element.querySelector('.item-characteristics-header').querySelector('.domain-name').innerText).toBe('Branding');
    });

    it('should display characteristics name', () => {
      component.hideCharacteristics = false;
      component.charState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      const element = fixture.nativeElement;

      expect(element.querySelector('.item-category').querySelector('.item-heading').innerText).toBe('Brand');
    });

    it('should display characteristics value', () => {
      component.hideCharacteristics = false;
      component.charState = DATA_STATE.RESOLVED;
      fixture.detectChanges();
      const element = fixture.nativeElement;

      expect(element.querySelector('.item-category').querySelector('.item-value').innerText).toBe('Stella Artois');
    });

    it('should display domains in order', () => {
      component.hideCharacteristics = false;
      fixture.detectChanges();

      expect(component.charDomainOrder[0]).toBe('PRODUCT IDENTIFICATION');
      expect(component.charDomainOrder[1]).toBe('BRANDING');
      expect(component.charDomainOrder[2]).toBe('PACKAGING');
      expect(component.charDomainOrder[3]).toBe('VOLUME');
      expect(component.charDomainOrder[4]).toBe('PROMOTION');
      expect(component.charDomainOrder[5]).toBe('SEGMENTATION');
      expect(component.charDomainOrder[6]).toBe('CATEGORY SPECIFIC');
      expect(component.charDomainOrder[7]).toBe('NUTRITION');
    });

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
        tick(1000);
        const element = fixture.nativeElement.querySelector('ion-error');
        expect(element).toBeTruthy();
      }));
      it(`should verify the view when data is resolved`, fakeAsync(() => {
        component.dataState = DATA_STATE.RESOLVED;
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('.item-name');
        expect(element).toBeTruthy();
      }));

      it(`should verify the charactristics view when data is resolved`, fakeAsync(() => {
        component.dataState = DATA_STATE.RESOLVED;
        component.charState = DATA_STATE.RESOLVED;
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('.chars-container');
        expect(element).toBeTruthy();
      }));
    });
  });

  describe('getInnovationClassByLevel()', () => {
    let getInnovationClassByLevel_Method;

    beforeEach(() => {
      getInnovationClassByLevel_Method = component['getInnovationClassByLevel'];
    });
    it('Should return empty string when called with unknown level', () => {
      expect(getInnovationClassByLevel_Method('random value')).toEqual('');
      expect(getInnovationClassByLevel_Method('')).toEqual('');
    });

    it('Should return the appropriate class for the given level', () => {
      expect(getInnovationClassByLevel_Method('New to category')).toEqual('accent');
      expect(getInnovationClassByLevel_Method('new to manufacturer')).toEqual('primary');
      expect(getInnovationClassByLevel_Method('New to Brand')).toEqual('secondary');
    });
  });
});
