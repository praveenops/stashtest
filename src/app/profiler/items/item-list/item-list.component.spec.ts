import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UnitTestingModule } from '../../../unit-testing.module';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { ItemListComponent } from './item-list.component';
import { LANDING_PAGE_MOCK } from '../../../shared/mockdata/landing.page.mockdata';
import { ArrayUtils } from '../../../shared/utils/array-utils';
import { ProfilerContextService } from '../../profiler-context-service';
import { Store, StoreModule } from '@ngrx/store';
import { FEATURE } from '../../../features';
import { appReducers } from '../../../_store/app-reducers';
import { profilerReducers } from '../../_store/profiler-reducers';

@Component({
  template: `<ion-item-list [items]="items" [factType]="factType" [currency]="currency" #itemList></ion-item-list>`
})
class ItemListWrapperComponent {
  items = LANDING_PAGE_MOCK['itemsList'];
  factType = 'Value Sales';
  currency = 'USD';
  @ViewChild('itemList') itemList;
}

xdescribe('ItemListComponent', () => {
  let component: ItemListWrapperComponent;
  let fixture: ComponentFixture<ItemListWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemListComponent, ItemListWrapperComponent],
      imports: [
        UnitTestingModule,
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers)
      ],
      providers: [ProfilerContextService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListWrapperComponent);
    component = fixture.componentInstance;
    component['store'] = fixture.debugElement.injector.get(Store);
  });

  describe('Defaults', () => {
    it('Should define the "gridFilter" with 4 columns', () => {
      fixture.detectChanges();
      expect(component.itemList.gridFilter['_keys']).toEqual(['name', 'type', 'oneAcvDate', 'innovationSales']);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.itemList).toBeTruthy();
  });

  it(`should have table with classes`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    expect(element).toBeTruthy();

    expect(element.classList.contains('table')).toBe(true);
    expect(element.classList.contains('table-hover')).toBe(true);
    expect(element.classList.contains('table-responsive')).toBe(true);
    expect(element.classList.contains('itemsList')).toBe(true);
  });

  it(`should have table row with item headers`, () => {
    fixture.detectChanges();
    console.log(component.itemList);
    const element = fixture.nativeElement.querySelector('table');
    const trEle = element.querySelector('.item-header');
    const tableHeadings = trEle.querySelectorAll('th');

    expect(tableHeadings.length).toBe(4);
    expect(tableHeadings[0].classList).toContain('innovation-name');

    const itemsCount = component.itemList.filteredItems.length;

    expect(tableHeadings[0].innerHTML).toContain(`${itemsCount} Items`);
    expect(tableHeadings[1].innerHTML).toContain(`Type`);
    expect(tableHeadings[2].innerHTML).toContain(`Start Date`);
    expect(tableHeadings[3].innerHTML).toContain(`Innovation Sales`);
  });

  it(`should display "Item" as header name if only one item is present`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const trEle = element.querySelector('.item-header');
    const tableHeadings = trEle.querySelectorAll('th');
    component.itemList.filteredItems = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }];
    fixture.detectChanges();
    const itemsCount = component.itemList.filteredItems.length;
    expect(tableHeadings[0].querySelector('span').innerHTML.trim()).toBe(`${itemsCount} Item`);
  });

  it(`should display innovation type in title case order`, fakeAsync(() => {
    fixture.detectChanges();

    component.itemList.filteredItems = [
      {
        'name': 'Diet Coke',
        'type': 'LINE EXTENSION',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }];
    fixture.detectChanges();
    tick(100);
    const element = fixture.nativeElement.querySelectorAll('td');
    expect(element[1].querySelector('span').innerHTML).toBe('Line Extension');
  }));

  it(`should display "Items" as header name if multiple items are present`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const trEle = element.querySelector('.item-header');
    const tableHeadings = trEle.querySelectorAll('th');
    component.itemList.filteredItems = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      },
      {
        'name': 'BIC 3 Action',
        'type': 'Line EX',
        'appDate': 'N/A',
        'oneAcvDate': 'N/A',
        'innovationSales': '2000',
        'currency': 'dollar',
        'nanKey': '10000002'
      }];
    fixture.detectChanges();
    const itemsCount = component.itemList.filteredItems.length;

    expect(tableHeadings[0].querySelector('span').innerHTML.trim()).toBe(`${itemsCount} Items`);
  });
  it(`should have item rows in the table`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const itemRowsEle = element.querySelectorAll('.item-row');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      },
      {
        'name': 'BIC 3 Action',
        'type': 'Line Ex',
        'appDate': 'N/A',
        'oneAcvDate': 'N/A',
        'innovationSales': '2000',
        'currency': 'dollar',
        'nanKey': '10000002'
      },
      {
        'name': 'BIC Flex 3',
        'type': 'Line Ex',
        'appDate': '30 Jan 2017',
        'oneAcvDate': '31 Jan 2017',
        'innovationSales': '1000',
        'currency': 'dollar',
        'nanKey': '10000001'
      }
    ];

    expect(itemRowsEle.length).toBe(component.itemList.filteredItems.length);

    expect(element.querySelector('[name="' + component.itemList.filteredItems[0].name + '"]').innerHTML).toContain(expectedData[0].name);
    expect(element.querySelector('[type="' + component.itemList.filteredItems[0].type + '"]').innerHTML).toContain(expectedData[0].type);
    expect(element.querySelector('[AcvDate="' + component.itemList.filteredItems[0].oneAcvDate + '"]').innerHTML)
      .toContain(expectedData[0].oneAcvDate);
    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[0].innovationSales + '"]')
      .innerHTML).toContain(expectedData[0].innovationSales);

    expect(element.querySelector('[name="' + component.itemList.filteredItems[1].name + '"]').innerHTML).toContain(expectedData[1].name);
    expect(element.querySelector('[type="' + component.itemList.filteredItems[1].type + '"]').innerHTML).toContain(expectedData[1].type);
    expect(element.querySelector('[AcvDate="' + component.itemList.filteredItems[1].oneAcvDate + '"]').innerHTML)
      .toContain(expectedData[1].oneAcvDate);
    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[1].innovationSales + '"]')
      .innerHTML).toContain(expectedData[1].innovationSales);

    expect(element.querySelector('[name="' + component.itemList.filteredItems[2].name + '"]').innerHTML).toContain(expectedData[2].name);
    expect(element.querySelector('[type="' + component.itemList.filteredItems[2].type + '"]').innerHTML).toContain(expectedData[2].type);
    expect(element.querySelector('[AcvDate="' + component.itemList.filteredItems[2].oneAcvDate + '"]').innerHTML)
      .toContain(expectedData[2].oneAcvDate);
    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[2].innovationSales + '"]')
      .innerHTML).toContain(expectedData[2].innovationSales);

    const spy = spyOn(component.itemList.selectedItemChange, 'emit');
    itemRowsEle[0].click();

    expect(spy).toHaveBeenCalledWith(component.itemList.filteredItems[0]);
  });

  it(`should call util method to sort domains on item name column`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('.sort');
    element[0].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on item name header click`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('th');
    element[0].querySelector('span').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on item type column`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('.sort');
    element[1].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on item type header click`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('th');
    element[1].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on app date column`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('.sort');
    element[2].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on app date header click`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('th');
    element[2].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on innovation-Sales column`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('.sort');
    element[3].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call util method to sort domains on innovation-Sales header click`, () => {
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    const element = fixture.nativeElement.querySelectorAll('th');
    element[3].querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it(`should show descending icon on innovation sales by default`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelectorAll('.sort');
    const icon = element[element.length - 1].querySelector('nd-icon');
    expect(icon).toBeTruthy();
    expect(component.itemList.sortStatus[3]).toBe('downward');
  });

  it(`Clicking on innovation-sales descending icon should reverse the order of arrow`, () => {
    fixture.detectChanges();
    const currentSortStatus = component.itemList.sortStatus[3];
    const element = fixture.nativeElement.querySelectorAll('.sort');
    element[element.length - 1].querySelector('nd-icon').click();
    fixture.detectChanges();
    const icon = element[element.length - 1].querySelector('nd-icon');
    expect(component.itemList.sortStatus[3]).not.toBe(currentSortStatus);
  });

  it(`Clicking on unsorted 'name' column descending icon should not reverse arrow`, () => {
    fixture.detectChanges();
    const currentSortStatus = component.itemList.sortStatus[0];
    component.itemList.sortBy = 'innovationSales';
    const element = fixture.nativeElement.querySelector('.sort');
    const event = new Event('mouseenter');
    fixture.detectChanges();
    element.querySelector('nd-icon').click();
    const icon = fixture.nativeElement.querySelector('.sort').querySelector('nd-icon');
    expect(icon).toBeTruthy();
    expect(component.itemList.sortStatus[0]).toBe(currentSortStatus);
  });

  it(`Should show icon on hover of item name column`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.sort');
    const event = new Event('mouseenter');
    element.dispatchEvent(event);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.sort').querySelector('nd-icon');
    expect(icon).toBeTruthy();

  });
  it(`Should show icon on hover of item type column`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelectorAll('.sort')[1];
    const event = new Event('mouseenter');
    element.dispatchEvent(event);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.sort').querySelector('nd-icon');
    expect(icon).toBeTruthy();

  });

  it(`Should show descending icon on hover by default`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.sort');
    const event = new Event('mouseenter');
    element.dispatchEvent(event);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.sort').querySelector('nd-icon');
    expect(icon).toBeTruthy();
    expect(component.itemList.sortStatus[0]).toBe('downward');


  });

  it(`Should allow to click on icon on mouse hover`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.sort');
    const event = new Event('mouseenter');
    element.dispatchEvent(event);
    fixture.detectChanges();
    const spy = spyOn(ArrayUtils, 'quicksort');
    element.querySelector('nd-icon').click();
    expect(spy).toHaveBeenCalled();
  });

  it('Should sort items with innovation sales in descending order while loading', () => {
    fixture.detectChanges();

    const expectedData = [

      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      },
      {
        'name': 'BIC 3 Action',
        'type': 'Line EX',
        'appDate': 'N/A',
        'oneAcvDate': 'N/A',
        'innovationSales': '2000',
        'currency': 'dollar',
        'nanKey': '10000002'
      },
      {
        'name': 'BIC Flex 3',
        'type': 'Line EX',
        'appDate': '30 Jan 2017',
        'oneAcvDate': '31 Jan 2017',
        'innovationSales': '1000',
        'currency': 'dollar',
        'nanKey': '10000001'
      }
    ];

    expect(component.itemList.filteredItems[0].innovationSales).toBe(expectedData[0].innovationSales);
    expect(component.itemList.filteredItems[1].innovationSales).toBe(expectedData[1].innovationSales);
    expect(component.itemList.filteredItems[2].innovationSales).toBe(expectedData[2].innovationSales);

  });

  it('Should show oneAcvDate in "DD MMM YYYY format" or show N/A when empty', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      },
      {
        'name': 'BIC 3 Action',
        'type': 'Line EX',
        'appDate': 'N/A',
        'oneAcvDate': 'N/A',
        'innovationSales': '2000',
        'currency': 'dollar',
        'nanKey': '10000002'
      },
      {
        'name': 'BIC Flex 3',
        'type': 'Line EX',
        'appDate': '30 Jan 2017',
        'oneAcvDate': '31 Jan 2017',
        'innovationSales': '1000',
        'currency': 'dollar',
        'nanKey': '10000001'
      }
    ];
    expect(element.querySelector('[AcvDate="' + component.itemList.filteredItems[0].oneAcvDate + '"]').innerHTML)
      .toContain(expectedData[0].oneAcvDate);
    expect(element.querySelector('[AcvDate="' + component.itemList.filteredItems[1].oneAcvDate + '"]').innerHTML)
      .toContain(expectedData[1].oneAcvDate);
    expect(element.querySelector('[AcvDate="' + component.itemList.filteredItems[2].oneAcvDate + '"]').innerHTML)
      .toContain(expectedData[2].oneAcvDate);

  });

  it(`should have $ symbol in front of innovation sales when factType is Value Sales and currency is USD`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const itemRowsEle = element.querySelectorAll('.item-row');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '$10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }
    ];

    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[0].innovationSales + '"]')
      .innerHTML).toContain(expectedData[0].innovationSales);
  });

  it(`should have € symbol in front of innovation sales when factType is Value Sales and currency is EUR`, () => {
    component.currency = 'EUR';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const itemRowsEle = element.querySelectorAll('.item-row');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '€10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }
    ];

    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[0].innovationSales + '"]')
      .innerHTML).toContain(expectedData[0].innovationSales);
  });

  it(`should have £ symbol in front of innovation sales when factType is Value Sales and currency is GBP`, () => {
    component.currency = 'GBP';
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const itemRowsEle = element.querySelectorAll('.item-row');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '£10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }
    ];

    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[0].innovationSales + '"]')
      .innerHTML).toContain(expectedData[0].innovationSales);
  });

  it(`should have no symbol in front of innovation sales when factType is Unit Sales`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const itemRowsEle = element.querySelectorAll('.item-row');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }
    ];

    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[0].innovationSales + '"]')
      .innerHTML).toContain(expectedData[0].innovationSales);
  });

  it(`should have no symbol in front of innovation sales when factType is Eq. Unit Sales`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('table');
    const itemRowsEle = element.querySelectorAll('.item-row');

    const expectedData = [
      {
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      }
    ];

    expect(element.querySelector('[innovationSales="' + component.itemList.filteredItems[0].innovationSales + '"]')
      .innerHTML).toContain(expectedData[0].innovationSales);
  });

  describe('extractFilterMetadata()', () => {
    beforeEach(() => {
      component.itemList.filteredItems = [{
        'name': 'Diet Coke',
        'type': 'Soda Drink',
        'appDate': '12 Mar 2016',
        'oneAcvDate': '13 Mar 2016',
        'innovationSales': '10000',
        'currency': 'dollar',
        'nanKey': '20000001'
      },
      {
        'name': 'BIC 3 Action',
        'type': 'Line EX',
        'appDate': 'N/A',
        'oneAcvDate': 'N/A',
        'innovationSales': '2000',
        'currency': 'dollar',
        'nanKey': '10000002'
      },
      {
        'name': 'BIC Flex 3',
        'type': 'Line EX',
        'appDate': '30 Jan 2017',
        'oneAcvDate': '31 Jan 2017',
        'innovationSales': '1000',
        'currency': 'dollar',
        'nanKey': '10000001'
      }];
      fixture.detectChanges();

      component.itemList.extractFilterMetadata();
    });

    it('Should populate "gridFilter" models', () => {
      expect(component.itemList.gridFilter.models['name'].items.length).toBe(3);
      expect(component.itemList.gridFilter.models['type'].items.length).toBe(2);
      expect(component.itemList.gridFilter.models['oneAcvDate'].items.length).toBe(3);
      expect(component.itemList.gridFilter.models['innovationSales'].items.length).toBe(3);
    });
  });

});
