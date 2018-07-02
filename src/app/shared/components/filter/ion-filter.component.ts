import { Component, OnInit, Input, Output, SimpleChanges, OnChanges, EventEmitter, ViewEncapsulation } from '@angular/core';
import { set } from 'd3-collection';
import { FilterModel, Entry } from './ion-filter-models';

@Component({
  selector: 'ion-filter',
  templateUrl: './ion-filter.component.html',
  styleUrls: ['./ion-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterComponent implements OnInit, OnChanges {
  @Input('data') data: FilterModel;
  @Output('change') change: EventEmitter<FilterModel> = new EventEmitter<FilterModel>();
  searchText: string;
  items: Array<Entry>;
  searchDebounceTimer;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.items = this.data.items;
    }
  }

  checkChange(e, item: Entry) {
    item.selected = e.target.checked;
    this.emitChangeEvent();
  }

  private emitChangeEvent() {
    this.data.update();
    this.change.emit(this.data);
  }

  changeSelectAll(event) {
    this.data.selectedAll = event.target.checked;
    this.data.items.forEach(e => e.selected = this.data.selectedAll);
    this.emitChangeEvent();
  }

  onSearch(event) {
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      const text = (event.target.value || '').toLowerCase();
      this.items = this.data.items.filter(e => e.label.toLowerCase().includes(text));
    }, 200);
  }

}
