import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { ArrayUtils } from '../../../shared/utils/array-utils';
import { DateUtils } from '../../../shared/utils/date-utils';
import { Store } from '@ngrx/store';
import { FEATURE } from '../../../features';
import { ActivatedRoute, Router } from '@angular/router';
import { NielsenColors } from 'ion-ui-components';
import { PROFILE_REDUCERS } from '../../_store/profiler-reducers';
import { DATA_STATE } from '../../../_store/data-states';
import { convertDataMarketInnovationShare, convertDataInnovationToMarket, calculateScaleFactor } from '../../utils/dataTransformers';
import { ProfilerContextService } from '../../profiler-context-service';
import { ProfilerRootComponent } from '../../profiler-root-component';
import { GridFilter, FilterModel, Entry } from '../../../shared/components/filter/ion-filter-models';

class SortInfo {
  sortBy: string;
  order: string;
  type: string;
}

@Component({
  selector: 'ion-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent extends ProfilerRootComponent implements OnInit, OnChanges {

  @Input('items') items;
  @Input('selectedItem') selectedItem;
  @Input('factType') factType;
  @Input('currency') currency;
  @Output() selectedItemChange = new EventEmitter();

  sortBy: any;
  sortInfo: SortInfo = new SortInfo();
  sortStatus = new Array(4).fill('downward');
  filteredItems = [];
  gridFilter: GridFilter = new GridFilter(['name', 'type', 'oneAcvDate', 'innovationSales']);
  activeFilter: string;
  currencyNametoSymbol: { [key: string]: string } = { 'USD': '$', 'EUR': '€', 'GBP': '£' };
  set: any;

  constructor(
    store: Store<any>,
    profileContextService: ProfilerContextService
  ) {
    super(store, profileContextService);
  }

  @HostListener('document:click', ['$event'])
  documentClick(event) {
    this.activeFilter = '';
  }
  ngOnInit() {
    this.sortList('innovationSales', 'number', 3);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.filteredItems = changes.items.currentValue;
      this.extractFilterMetadata();
    }
  }

  onItemSelection(item) {
    this.selectedItem = item;
    this.selectedItemChange.emit(item);
  }

  sortList(key, type, index) {
    let order: string;
    if (this.sortBy === key) {
      // If column is already sorted on click of 'up' arrow it should trigger descending
      order = (this.sortStatus[index] === 'upward') ? 'desc' : 'asc';
      this.sortStatus[index] = (this.sortStatus[index] === 'downward') ? 'upward' : 'downward';
    } else {
      // If column is not sorted on click of 'down' arrow it should trigger descending
      order = (this.sortStatus[index] === 'upward') ? 'asc' : 'desc';
      // this.sortStatus[index] === 'upward' ? order = 'asc' : order = 'desc';
    }
    this.sortBy = key;
    this.sortInfo.sortBy = key;
    this.sortInfo.order = order;
    this.sortInfo.type = type;
    // To show down arrow in all the unsorted columns on hover
    this.sortStatus = this.sortStatus.map((d, i) => {
      return (i === index) ? d : 'downward';
    });
    this.filteredItems = ArrayUtils.quicksort(this.filteredItems, key, type, order);
  }

  formatDate(date) {
    const splitDate = date.split(' ', 2);
    return (splitDate.length === 2) ? DateUtils.formatYYYYMMDDDate(splitDate[0]) : DateUtils.formatMMDDYYYYDate(splitDate[0]);
  }

  applyFilter(event: FilterModel, column: string) {
    if (event instanceof FilterModel) {
      const filters: Array<FilterModel> = this.gridFilter.filters;
      const items = this.items.filter((item) => {
        for (const filter of filters) {
          if (filter.filtered) {
            if (filter.unselectedValues.indexOf(item[filter.key]) !== -1) {
              return false;
            }
          }
        }
        return true;
      });
      this.filteredItems = ArrayUtils.quicksort(items, this.sortInfo.sortBy, this.sortInfo.type, this.sortInfo.order);

      this.gridFilter.updateRelativeModels(event, this.filteredItems);
    }
  }

  extractFilterMetadata() {
    const uniqueMap = { type: {}, name: {}, innovationSales: {}, oneAcvDate: {} };
    this.filteredItems.forEach((item) => {
      if (uniqueMap.type[item.type] === undefined) {
        uniqueMap.type[item.type] = new Entry(item.type, item.type, item.typeShortName);
      }
      if (uniqueMap.name[item.name] === undefined) {
        uniqueMap.name[item.name] = new Entry(item.name, item.name);
      }
      if (uniqueMap.innovationSales[item.innovationSales] === undefined) {
        uniqueMap.innovationSales[item.innovationSales] = new Entry(item.innovationSales
          , (this.factType === 'Value Sales' ? this.currencyNametoSymbol[this.currency] : '') + item.innovationSales);
      }
      if (uniqueMap.oneAcvDate[item.oneAcvDate] === undefined) {
        uniqueMap.oneAcvDate[item.oneAcvDate] = new Entry(item.oneAcvDate
          , item.oneAcvDate ? this.formatDate(item.oneAcvDate) : 'N/A');
      }
    });

    this.gridFilter.models['name'].items = ArrayUtils.quicksort(Object.values(uniqueMap.name), 'value', 'string', 'asc');
    this.gridFilter.models['type'].items = ArrayUtils.quicksort(Object.values(uniqueMap.type), 'value', 'string', 'asc');
    this.gridFilter.models['innovationSales'].items = ArrayUtils
      .quicksort(Object.values(uniqueMap.innovationSales), 'value', 'number', 'asc');
    this.gridFilter.models['oneAcvDate'].items = ArrayUtils
      .quicksort(Object.values(uniqueMap.oneAcvDate), 'value', 'date', 'asc');
  }

  invokeFilter(e, type) {
    this.activeFilter = this.activeFilter === type ? '' : type;
    e.stopPropagation();
  }
}

