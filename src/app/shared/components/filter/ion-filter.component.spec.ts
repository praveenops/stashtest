import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild, DebugElement, OnInit } from '@angular/core';
import { FilterComponent } from './ion-filter.component';
import { UnitTestingModule } from '../../../unit-testing.module';
import { FilterModel, Entry } from './ion-filter-models';
import { By } from '@angular/platform-browser';


@Component({
  template: `
  <ion-filter [data]="data" (change)="onChange($event)" #view></ion-filter>
  `
})
class FilterWrapperComponent implements OnInit {
  @ViewChild(FilterComponent) view: FilterComponent;
  data: FilterModel = new FilterModel('city');

  ngOnInit() {
    this.data.items.push(new Entry('HYD', 'hyderabad'));
    this.data.items.push(new Entry('SEC', 'Secunderabad'));
    this.data.items.push(new Entry('MUM', 'Mumbai'));
    this.data.items.push(new Entry('BNG', 'Bangalore'));
    this.data.items.push(new Entry('CHN', 'Chennai'));
  }

  onChange(event) {
  }
}

describe('FilterComponent', () => {
  let component: FilterWrapperComponent;
  let fixture: ComponentFixture<FilterWrapperComponent>;
  let filter: FilterComponent;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent, FilterWrapperComponent],
      imports: [UnitTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterWrapperComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
    filter = component.view;
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template', () => {
    beforeEach(() => { });

    it('Should have "header" and "items" sections', () => {
      fixture.detectChanges();
      expect(debugElement.query(By.css('ion-filter .header')).nativeElement).toBeDefined();
      expect(debugElement.query(By.css('ion-filter .items')).nativeElement).toBeDefined();
    });

    it('Should create both versions of labels when "shortlabel" is given', () => {
      component.data.items[0].shortLabel = 'hyd';
      fixture.detectChanges();
      expect(debugElement.query(By.css('ion-filter .items .item-name.full')).nativeElement.innerHTML).toBe('hyderabad');
      expect(debugElement.query(By.css('ion-filter .items .item-name.short')).nativeElement.innerHTML).toBe('hyd');
    });

    it('Should create only one version of label if there is no "shortlabel"', () => {
      fixture.detectChanges();
      expect(debugElement.query(By.css('ion-filter .items .item-name.full'))).toBeNull();
      expect(debugElement.query(By.css('ion-filter .items .item-name.short'))).toBeNull();
    });
  });

  describe('changeSelectAll(event)', () => {
    const eventObj = { target: { checked: false } };
    beforeEach(() => {
    });

    it('Should select all items when "selectAll" checked', () => {
      eventObj.target.checked = true;
      filter.changeSelectAll(eventObj);

      const selectedCount = filter.items.filter(e => e.selected).length;
      expect(filter.items.length).toBe(selectedCount);
    });

    it('Should unselect all items when "selectAll" unchecked', () => {
      eventObj.target.checked = false;
      filter.changeSelectAll(eventObj);

      const selectedCount = filter.items.filter(e => e.selected).length;
      expect(selectedCount).toBe(0);
    });
  });

  describe('onSearch(event)', () => {
    const eventObj = { target: { value: '' } };
    beforeEach(() => {
    });

    it('Should filter items based on search', fakeAsync(() => {
      eventObj.target.value = 'bad';
      filter.onSearch(eventObj);
      tick(250);
      fixture.detectChanges();

      expect(debugElement.queryAll(By.css('.items .item')).length).toBe(2);
    }));

    it('Should not show any items if no match found', fakeAsync(() => {
      eventObj.target.value = 'no match found for this string';
      filter.onSearch(eventObj);
      tick(250);
      fixture.detectChanges();

      expect(debugElement.queryAll(By.css('.items .item')).length).toBe(0);
    }));
  });

  describe('emitChangeEvent()', () => {
    beforeEach(() => { });

    it('Should call "update" on "FilterModel"', () => {
      spyOn(filter.data, 'update');
      filter['emitChangeEvent']();
      expect(filter.data.update).toHaveBeenCalled();
    });

    it('Should call "emit" on "changeEvent"', () => {
      spyOn(filter.change, 'emit');
      filter['emitChangeEvent']();
      expect(filter.change.emit).toHaveBeenCalled();
    });
  });

  describe('checkChange(event,item)', () => {
    let event, item;
    beforeEach(() => {
      event = { target: { checked: true } };
      item = new Entry('value', 'this is label');
    });

    it('Should update the selected property of given item', () => {
      event.target.checked = false;
      component.view.checkChange(event, item);
      expect(item.selected).toBeFalsy();
    });
  });
});
