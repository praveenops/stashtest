import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { ArrayUtils } from '../../shared/utils/array-utils';
import { Store } from '@ngrx/store';
import { FEATURE } from '../../features';
import { PROFILE_REDUCERS } from '../_store/profiler-reducers';
import { DATA_STATE } from '../../_store/data-states';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { APP_REDUCERS } from '../../_store/app-reducers';
import { RootComponent } from '../../root.component';
import { Utils } from '../../shared/utils/utils';

@Component({
  selector: 'ion-edit-profiler',
  templateUrl: './edit-profiler.component.html',
  styleUrls: ['./edit-profiler.component.scss'],
})
export class EditProfilerComponent extends RootComponent implements OnInit, OnChanges {

  @Input('projectInfo') projectInfo: any;
  @Output() updateMetadataDefaults = new EventEmitter();
  @Output('profilerContext') profilerContext: any;
  @ViewChild('factType') factType: ElementRef;
  datasetMetadata: any = {};
  dataState = DATA_STATE.INITIAL;
  errorCode: any;

  @Output() enableApplyButton = new EventEmitter();

  innovationTypes: any = null;
  timePeriods = null;
  categories: any = null;
  manufacturerBrandsMap: any;
  groups = ['Manufacturers', 'Brands', 'Sub-Brands'];
  selectedCategories: any;
  idsForSelectedCategories = [];
  brandTagsMap: any = { 'Manufacturer Level': 'MFR', 'Brand Level': 'BRD', 'Sub Brand Level': 'SBD' };
  innovationTypesOrder = ['New Brand/Brand Extension', 'New Sub-Brand', 'Line Extension',
    'Special Collection', 'Temporary'];
  selectedManufacturers: any;
  isPageEdited = false;
  periodLevels = { 'Period_Group_Level': 'groups', 'Year_Level': 'years', 'Quarter_Level': 'quarters' };
  groupTagMapping: any = { 'MFR': 'Manufacturer Level', 'BRD': 'Brand Level', 'SBD': 'Sub Brand Level' };
  changeInContext = {
    manufacturers: false,
    factType: false,
    category: false,
    timePeriod: false,
    innovationPeriods: false,
    innovationThresholds: false,
    innovationTypes: false
  };

  categorySegDisplay = {
    featureToggle: 'ION_FEATURE_CATEGORY_SEGMENTS',
    featureEnabled: false,
  };

  constructor(
    private store: Store<any>,
  ) {
    super();
  }

  ngOnInit() {
    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.PROFILER,
      state: 'datasetMetadata',
    }, (datasetMetadata) => {
      this.datasetMetadataSubscription(datasetMetadata);
    });

    this.checkFeatures();

    this.checkMandatoryFields();
  }

  private checkFeatures() {
    super.subscribe({
      store: this.store,
      feature: FEATURE.APP,
      reducer: APP_REDUCERS.APP_REDUCER,
      state: 'featureToggles'
    }, (featureFlags) => {
      if (featureFlags.state === DATA_STATE.RESOLVED) {
        this.categorySegDisplay.featureEnabled = featureFlags.data[
          this.categorySegDisplay.featureToggle] ? featureFlags.data[
          this.categorySegDisplay.featureToggle] : false;
      }
    });
  }

  private datasetMetadataSubscription(datasetMetadata) {
    this.dataState = datasetMetadata.state;
    if (datasetMetadata.state === DATA_STATE.RESOLVED) {
      this.datasetMetadata = datasetMetadata.data;
      this.datasetMetadata.periods && this.refactorTimePeriod();
      this.datasetMetadata.innovationTypes && this.refactorInnovationTypes();
      this.datasetMetadata.categories && this.refactorCategories();
      this.datasetMetadata.manufacturers && this.refactorManufacturers();
    } else if (datasetMetadata.state === DATA_STATE.ERROR) {
      this.errorCode = datasetMetadata.message;
    }
  }

  ngOnChanges(changes: any) {
    if (changes['projectInfo']) {
      this.profilerContext = Object.assign({}, this.projectInfo);
    }
  }

  onSubmit() {
    for (const key in this.changeInContext) {
      if (this.changeInContext.hasOwnProperty(key) && this.changeInContext[key]) {
        this.updateMetadataDefaults.emit(this.profilerContext);
        break;
      }
    }
    this.resetChangeInContext();
  }

  reset() {
    this.datasetMetadata.periods && this.refactorTimePeriod();
    this.datasetMetadata.innovationTypes && this.refactorInnovationTypes();
    this.datasetMetadata.categories && this.refactorCategories();
    this.datasetMetadata.manufacturers && this.refactorManufacturers();

    if (this.factType && this.factType.nativeElement) {
      this.factType.nativeElement.selected = this.projectInfo.factType.id;
    }
    this.profilerContext = Object.assign({}, this.projectInfo);
    this.resetChangeInContext();
  }

  resetChangeInContext() {
    for (const key in this.changeInContext) {
      if (this.changeInContext.hasOwnProperty(key)) {
        this.changeInContext[key] = false;
      }
    }
  }

  onSelection(selection, event) {
    this.isPageEdited = true;
    switch (selection) {
      case 'timePeriod':
        this.profilerContext.timePeriod = this.datasetMetadata.periods.find((item) => item.id === event);
        this.checkForContextChange(selection, this.profilerContext.timePeriod);
        break;
      case 'innovationPeriod':
        this.profilerContext.innovationPeriod = this.datasetMetadata.innovationPeriods.find((item) => item.id === event.target.selected);
        this.checkForContextChange(selection, this.profilerContext.innovationPeriod);
        break;
      case 'innovationTypes':
        this.profilerContext.innovationTypes = event.map(c => {
          return c.map(t => {
            return { id: t.value, name: t.label};
          });
        });

        this.checkForContextChange(selection, this.profilerContext.innovationTypes);
        break;
      case 'innovationThresholds':
        this.profilerContext.innovationThreshold = this.datasetMetadata
          .innovationThresholds
          .find((item) => item.id === event.target.selected);
        this.checkForContextChange(selection, this.profilerContext.innovationThreshold);
        break;
      case 'factType':
        this.profilerContext.factType = this.datasetMetadata.factTypes.find((item) => item.id === event.target.selected);
        this.checkForContextChange(selection, this.profilerContext.factType);
        break;
      case 'category':
        const selectedIds = [];
        this.profilerContext.categories = event.map(c => {
          let i = 0;
          if (c.length === 2) {
            selectedIds.push(c[1].value);
          } else {
            selectedIds.push(c[0].value);
          }
          return c.map(t => {
            return { id: t.value, name: t.label, type: i++ === 0 ? 'Category Level' : 'Segment Level' };
          });
        });
        this.selectedCategories = event;
        this.checkForContextChange(selection, selectedIds);
        break;
      case 'manufacturers':
        this.profilerContext.manufacturers = event.map((item) => ({
          id: item.value,
          name: item.label,
          type: this.groupTagMapping[item.groupTag]
        }));
        this.selectedManufacturers = event;
        this.checkForContextChange(selection, this.profilerContext.manufacturers);
        break;
    }
    this.checkMandatoryFields();
  }

  checkForContextChange(key, data) {
    let isDifferent = false;

    if (!data) {
      return;
    }

    if (key === 'category') {
      if (data.length !== this.idsForSelectedCategories.length) {
        isDifferent = true;
      } else {
        data.forEach(selected => {
          if (this.idsForSelectedCategories.indexOf(selected) === -1) {
            isDifferent = true;
          }
        });
      }
      this.changeInContext[key] = isDifferent;
    } else if (key === 'manufacturers') {
      if (data.length !== this.projectInfo[key].length) {
        this.changeInContext[key] = true;
        return;
      } else {
        data.forEach(selected => {
          if (isDifferent) {
            return true;
          }
          isDifferent = true;
          this.projectInfo[key].forEach(existing => {
            if (existing['id'] === selected['id']) {
              isDifferent = false;
            }
          });
        });
        this.changeInContext[key] = isDifferent;
      }
    } else if (key === 'innovationTypes') {
      if (data.length !== this.projectInfo[key].length) {
        this.changeInContext[key] = true;
        return;
      } else {
        let isDiff = true;
        data.forEach(selected => {
          let found = false;
          isDiff && this.projectInfo[key].forEach(existing => {
            if (!found && selected.length === existing.length) {
              if (selected.map(s => s.id).join(',') === existing.map(e => e.id).join(',')) {
                found = true;
              }
            }
          });
          isDiff = found;
        });
        this.changeInContext[key] = !isDiff;
      }
    } else {
      const value = this.projectInfo[key];
      if (value && value['id'] !== data['id']) {
        this.changeInContext[key] = true;
      } else {
        this.changeInContext[key] = false;
      }
    }
  }

  checkMandatoryFields() {
    let disableApplyButton = false;

    if (this.profilerContext) {
      if (this.profilerContext.categories && !this.profilerContext.categories.length) {
        disableApplyButton = true;
      } else if (this.profilerContext.manufacturers && !this.profilerContext.manufacturers.length) {
        disableApplyButton = true;
      } else if (this.profilerContext.innovationTypes && !this.profilerContext.innovationTypes.length) {
        disableApplyButton = true;
      }

      this.enableApplyButton.emit(!disableApplyButton);
    }
  }
  refactorInnovationTypes() {
    this.datasetMetadata = Object.assign({}, this.datasetMetadata, {
      innovationTypes: ArrayUtils.sortArrayWithGivenOrder(this.datasetMetadata.innovationTypes,
        this.innovationTypesOrder, 'name')
    });
    this.innovationTypes = {};
    this.innovationTypes.selected = this.projectInfo.innovationTypes.map(it => {
      it = Array.isArray(it) ? it : [it];
      return it.map(t => {
        return { value: t.id, label: t.name };
      });
    });

    this.innovationTypes.allValues = this.datasetMetadata.innovationTypes.map(it => {
      return {
        label: Utils.convertInTitle(it.name), value: it.id,
        items: it.children ? this.sortItems(this.getItems(it)) : []
      };
    });
  }

  /**
   * Method refactor the Time Period data in the format of level with respective entries
   * {
   *  years:[{id:2017, name: "2017"}]
   * }
   */
  refactorTimePeriod() {
    const result = {};
    const timePeriod = this.datasetMetadata['periods'];
    timePeriod.forEach((item) => {
      const level = this.periodLevels[item.type];
      if (result[level]) {
        result[level].push(item);
      } else {
        result[level] = [item];
      }
    });

    for (const item in result) {
      if (result.hasOwnProperty(item)) {
        result[item].sort((item1, item2) => item1.name < item2.name);
      }
    }

    this.timePeriods = result;
  }

  // TODO: refctor
  /* description has to be changed and method needs to be revisited it contains children which
  is no longer used in multi-select the below object returns
  [{label: "Level 1 - 1", value: "1",items:[]}] instead of existing output */

  /**
   * Method refactor the Time categories data in the format of level with respective entries
   *
   [{
    label: 'Level 1 - 1',
    value: '1',
    items: [{
      label: 'Level 2 - 1',
      value: '3'
      },
      {
      label: 'Level 2 - 2',
      value: '4'
      }.
      label: 'Level 2 - 3',
      value: '5'
      }]
   }]
   */
  refactorCategories() {
    /* Assume "Level 2 - 1", "Level 2- 3" are selected, then pass flat list as specified below,
       because we are passing useFlatData="true" for category multi-select-component
       selectedCategories = [
      [{label: 'Level 1 - 1', value: '1'}, { 'Level 2 - 1', value: '3'}], // for "Level 2 - 1"
      [{label: 'Level 1 - 1', value: '1'}, { 'Level 2 - 3', value: '5'}] // for "Level 2 - 3"
     ] */
    this.idsForSelectedCategories = [];
    this.selectedCategories = this.projectInfo.categories.map(c => {
      if (c.length === 2) {
        this.idsForSelectedCategories.push(c[1].id);
      } else {
        this.idsForSelectedCategories.push(c[0].id);
      }
      return c.map(t => {
        return { value: t.id, label: t.name };
      });
    });

    // categories : {label: 'Level 1 - 1', value: '1'}, items:[{label: 'Level 1 - 1', value: '1'}....]}
    this.categories = this.datasetMetadata.categories.map(category => {
      return {
        label: Utils.convertInTitle(category.name), value: category.id,
        items: this.categorySegDisplay.featureEnabled ? this.getItems(category) : []
      };
    });
    this.categories = this.sortItems(this.categories);
  }

  private getItems(category: any) {
    return category.children ? category.children.map(segment => {
      return segment = {
        label: Utils.convertInTitle(segment.name), value: segment.id
      };
    }) : [];
  }

  refactorManufacturers() {
    this.manufacturerBrandsMap = {
      'Manufacturers': { tag: 'MFR', data: [] },
      'Brands': { tag: 'BRD', data: [] },
      'Sub-Brands': { tag: 'SBD', data: [] }
    };
    /**
     * A unique key map to keep the uniqueness of items at each level
     */
    const uniqueManufacturerBrandsKeyMap = {
      'Manufacturers': {},
      'Brands': {},
      'Sub-Brands': {}
    };
    this.selectedManufacturers = this.projectInfo.manufacturers.map(item => {
      return { label: Utils.convertInTitle(item.name), value: item.id, groupTag: this.brandTagsMap[item.type] };
    });
    this.selectedManufacturers = this.sortItems(this.selectedManufacturers);
    this.constructManufacturerBrandsMap(this.datasetMetadata.manufacturers, uniqueManufacturerBrandsKeyMap);

    Object.keys(this.manufacturerBrandsMap).forEach(group => {
      this.manufacturerBrandsMap[group].data = this.sortItems(this.manufacturerBrandsMap[group].data);
    });
  }

  constructManufacturerBrandsMap(items, uniqueManufacturerBrandsKeyMap) {
    items.forEach(item => {
      switch (item.type) {
        case 'Manufacturer Level':
          if (!uniqueManufacturerBrandsKeyMap['Manufacturers'][item.id]) {
            uniqueManufacturerBrandsKeyMap['Manufacturers'][item.id] = item.id;
            this.manufacturerBrandsMap['Manufacturers'].data.push({ label: (Utils.convertInTitle(item.name)), value: item.id });
          }
          if (item.children) {
            this.constructManufacturerBrandsMap(item.children, uniqueManufacturerBrandsKeyMap);
          }
          break;
        case 'Brand Level':
          if (!uniqueManufacturerBrandsKeyMap['Brands'][item.id]) {
            uniqueManufacturerBrandsKeyMap['Brands'][item.id] = item.id;
            this.manufacturerBrandsMap['Brands'].data.push({ label: Utils.convertInTitle(item.name), value: item.id });
          }
          if (item.children) {
            this.constructManufacturerBrandsMap(item.children, uniqueManufacturerBrandsKeyMap);
          }
          break;
        case 'Sub Brand Level':
          if (!uniqueManufacturerBrandsKeyMap['Sub-Brands'][item.id]) {
            uniqueManufacturerBrandsKeyMap['Sub-Brands'][item.id] = item.id;
            this.manufacturerBrandsMap['Sub-Brands'].data.push({ label: Utils.convertInTitle(item.name), value: item.id });
          }
          break;
        default:
          break;

      }
    });
  }

  /** Sorting given hierarchical list alphabetically
   *
   * @param items
   */
  // TODO : refactor this function
  public sortItems(items) {
    if (items.length === 1 && items[0].items) {
      items[0].items = this.sortItems(items[0].items);
    } else {
      items = items.sort((item1, item2) => {
        if (item1.items) {
          item1.items = this.sortItems(item1.items);
        }
        if (item2.items) {
          item2.items = this.sortItems(item2.items);
        }

        const label1 = item1.label ? item1.label.toUpperCase() : null;
        const label2 = item2.label ? item2.label.toUpperCase() : null;

        return label1 > label2 ? 1 : label1 < label2 ? -1 : 0;
      });
    }
    return items;
  }
}
