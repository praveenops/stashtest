import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PROFILE_REDUCERS } from '../../_store/profiler-reducers';
import { FEATURE } from '../../../features';
import { PROFILER_ACTIONS } from '../../_store/profiler-actions';
import { DATA_STATE } from '../../../_store/data-states';
import { ArrayUtils } from '../../../shared/utils/array-utils';
import { RootComponent } from '../../../root.component';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/utils/utils';


@Component({
  selector: 'ion-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent extends RootComponent implements OnInit, OnDestroy, OnChanges {

  @Input() item: any;
  @Input() contextId: any;
  innovationSubTypes: string;
  subTypesOrder = ['25', '26', '37', '28', '36', '30', '31', '32', '2', '34', '35'];
  charDomainOrder = [
    'PRODUCT IDENTIFICATION',
    'BRANDING',
    'PACKAGING',
    'VOLUME',
    'PROMOTION',
    'SEGMENTATION',
    'CATEGORY SPECIFIC',
    'NUTRITION'
  ];
  itemInnovationDetails: any;
  dataState: string = DATA_STATE.INITIAL;
  charState: String = DATA_STATE.INITIAL;
  currentNanKey: string;
  subTypeDrivingChars = [];
  subTypeClassification: string;
  hideCharacteristics = true;
  charDetails = [];
  charErrorMessage: string;
  itemDetailsEmptyMessage: string;
  errorCode: any;
  errorCodeChar: any;

  constructor(
    private store: Store<any>,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.virtualPageView();

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.ITEM_DETAILS,
      state: 'itemDetails',
    }, (itemDetails) => {
      this.dataState = itemDetails.state;

      if (this.dataState === DATA_STATE.RESOLVED) {
        this.processInnovationDetails(itemDetails.data[0]);
      } else if (this.dataState === DATA_STATE.EMPTY) {
        this.itemDetailsEmptyMessage = itemDetails.message;
      } else if (this.dataState === DATA_STATE.ERROR) {
        this.errorCode = itemDetails.message;
      }

    });

    super.subscribe({
      store: this.store,
      feature: FEATURE.PROFILER,
      reducer: PROFILE_REDUCERS.ITEM_DETAILS,
      state: 'itemCharacteristics',
    }, (itemCharacteristics) => {
      this.charState = itemCharacteristics.state;
      this.itemCharacteristicsSubscription(itemCharacteristics);
    });


  }

  virtualPageView() {
    dataLayerPushPageview(this.router.url + '/' + this.currentNanKey);
  }

  ngOnChanges(changes: any) {
    this.hideCharacteristics = true;
    if (changes['item'] && this.item && this.currentNanKey !== this.item.nanKey) {
      this.currentNanKey = this.item.nanKey;
      this.itemInnovationDetails = {};
      this.subTypeDrivingChars = [];
      this.subTypeClassification = '';
      this.getInnovationDetails();
    }
  }


  getInnovationDetails() {
    // make item details API call
    const contextId = this.contextId;
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_ITEM_DETAILS,
      payload: {
        pathParams: [this.item.nanKey],
        queryParams: { contextId },
        data: {}
      }
    });

    // Making item pictures api call
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_ITEM_PICTURES,
      payload: {
        pathParams: [this.item.nanKey],
        queryParams: { contextId },
        data: {}
      }
    });

    // Making item characteristics api call
    this.store.dispatch({
      type: PROFILER_ACTIONS.GET_ITEM_CHARACTERISTICS,
      payload: {
        pathParams: [this.item.nanKey],
        queryParams: { contextId },
        data: {}
      }
    });


  }

  private itemCharacteristicsSubscription(itemCharacteristics) {
    if (itemCharacteristics.state === DATA_STATE.RESOLVED) {
      if (!itemCharacteristics.data.length) {

        this.charErrorMessage = 'Characteristics not available for this item.';
        this.charDetails = [];
      } else {
        this.charDetails = ArrayUtils.sortArrayWithGivenOrder(itemCharacteristics.data, this.charDomainOrder, 'domain');
      }
    } else if (itemCharacteristics.state === DATA_STATE.EMPTY) {

      this.charErrorMessage = itemCharacteristics.message;
      this.charDetails = [];
    } else if (itemCharacteristics.state === DATA_STATE.ERROR) {
      this.errorCodeChar = itemCharacteristics.message;
    }

  }

  processInnovationDetails(data: any) {

    this.itemInnovationDetails = data;

    this.innovationSubTypes = this.collectInnovationSubTypes(data.innovationSubtypeDetails);
    const hasNovelCombination = this.novelCombinationExist(data.innovationSubtypeDetails);

    if ((data.innovationType === 'LINE EXTENSION' && !hasNovelCombination)
      || data.innovationType === 'SPECIAL COLLECTION' || data.innovationType === 'MINOR CHANGE OFFERING') {
      this.subTypeDrivingChars = this.collectSubtypeDrivings(data.innovationSubtypeDetails);
    } else if (data.innovationType === 'LINE EXTENSION' && hasNovelCombination) {
      this.innovationSubTypes = 'Novel Combination';
      this.subTypeClassification = this.collectInnovationClassification(data);
    } else {
      this.subTypeClassification = this.collectInnovationClassification(data);
    }

  }

  collectInnovationSubTypes(subTypes) {
    const innovationSubTypes = [];
    this.subTypesOrder.forEach((subTypeId) => {
      const subType = subTypes.find((item) => item.innovationSubtypeCode === subTypeId);
      subType && innovationSubTypes.push(subType.innovationSubtype);
    });

    return innovationSubTypes.join(', ');
  }

  private getInnovationClassByLevel(innovationLevel: string): string {
    let cls = '';
    if (innovationLevel) {
      innovationLevel = innovationLevel.toLowerCase().trim();
      switch (innovationLevel) {
        case 'new to category':
          cls = 'accent';
          break;
        case 'new to manufacturer':
          cls = 'primary';
          break;
        case 'new to brand':
          cls = 'secondary';
          break;
      }
    }
    return cls;
  }

  collectSubtypeDrivings(subTypes) {
    const subTypeDrivingChars = [];
    const isSubLineExists = this.subLineExist(subTypes);

    this.subTypesOrder.forEach((subTypeId) => {
      const subType = subTypes.find((item) => item.innovationSubtypeCode === subTypeId);
      if (subType) {
        const drivingChars = subType.drivingChars.map((item) => {
          // ignoring the combination of Product Variant Claim char under Subline
          const LOIShouldBeConsidered = isSubLineExists ? (item.charDescription !== 'GLOBAL PRODUCT VARIANT CLAIM') : true;
          return {
            id: item.charCode,
            value: item.charValueDescription,
            innovationLevel: LOIShouldBeConsidered ? item.innovationLevel : '',
            innovationClass: LOIShouldBeConsidered ? this.getInnovationClassByLevel(item.innovationLevel) : ''
          };
        });

        subTypeDrivingChars.push({
          subType: subType.innovationSubtype,
          drivingChars: drivingChars.sort((a, b) => a.id - b.id)
        });
      }
    });

    return subTypeDrivingChars;
  }

  collectInnovationClassification(data) {
    // transforming the data to Title Cases for reading purpose
    const transformedData = {
      brand1: Utils.convertInTitle(data.brand1),
      gbe: Utils.convertInTitle(data.gbe),
      country: Utils.convertInTitle(data.country),
      category: Utils.convertInTitle(data.category),
      innovationType: Utils.convertInTitle(data.innovationType)
    };
    const gbe = Utils.convertInTitle(data.gbe);
    // from OGRDS brand1 is Brand Extension, Sub Brand is GBE
    switch (data.innovationType.toUpperCase()) {
      case 'NEW BRAND':
        return `${transformedData.brand1} is a new brand in ${transformedData.country}`;
      case 'BRAND EXTENSION':
        return `The ${transformedData.brand1} has extended to the ${transformedData.category} category in ${transformedData.country}`;
      case 'NEW SUB-BRAND':
        return `${transformedData.gbe} is a new sub-brand for ${transformedData.brand1} in ${transformedData.country}`;
      case 'LINE EXTENSION':
        return `Item represents a new combination of existing characteristic values for the ${transformedData.gbe} sub-brand`;
      default:
        return `This is a ${transformedData.innovationType}`;
    }
  }

  novelCombinationExist(subtypes) {
    return subtypes.find((item) => item.innovationSubtype === 'NOVEL COMBINATION');
  }

  subLineExist(subtypes) {
    return subtypes.find((item) => item.innovationSubtype === 'SUBLINE');
  }
}
