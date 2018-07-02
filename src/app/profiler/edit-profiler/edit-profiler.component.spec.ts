import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EditProfilerComponent } from './edit-profiler.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PROFILER } from '../../shared/mockdata/profiler.metadata.mockdata';
import { UnitTestingModule } from '../../unit-testing.module';
import { SharedModule } from '../../shared/shared.module';
import { Store, StoreModule } from '@ngrx/store';
import { FEATURE } from '../../features';
import { appReducers } from '../../_store/app-reducers';
import { profilerReducers } from '../_store/profiler-reducers';
import { PROFILER_ACTIONS } from '../_store/profiler-actions';
import { DATA_STATE } from '../../_store/data-states';
import { Utils } from '../../shared/utils/utils';

describe('EditProfilerComponent', () => {
  let component: EditProfilerComponent;
  let fixture: ComponentFixture<EditProfilerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfilerComponent, EditProfilerComponent],
      imports: [
        UnitTestingModule, SharedModule,
        StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
        StoreModule.forFeature(FEATURE.APP, appReducers),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(EditProfilerComponent);
    component = fixture.componentInstance;
    component['store'] = fixture.debugElement.injector.get(Store);
    component.projectInfo = PROFILER['METADATA']['datasetDefaults']['1']['defaults']['factContext'];
  });

  it(`should create`, () => {
    expect(component).toBeTruthy();
  });


  describe(`onInit`, () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it(`should call 'datasetMetadataSubscription' when datasetMetadata dispatched`, () => {
      const datasetMetadata = [...PROFILER['METADATA']['datasetMetadata']['1']];

      const spy = spyOn<any>(component, 'datasetMetadataSubscription');

      component['store'].dispatch({
        type: PROFILER_ACTIONS.GET_DATASET_METADATA_RESOLVED,
        payload: {
          data: datasetMetadata
        }
      });

      const input = {
        data: PROFILER['METADATA']['datasetMetadata']['1'][0],
        state: DATA_STATE.RESOLVED,
        message: ''
      };

      expect(spy).toHaveBeenCalledWith(input);
    });

  });

  describe(`checkForContextChange`, () => {
    it(`should do nothing when data is empty`, () => {
      component.checkForContextChange('category', '');
      expect(component.changeInContext['category']).toBe(false);
    });

    it(`should set changeInContext for category when category and idsForSelectedCategories length are not same`, () => {
      component.idsForSelectedCategories = [1, 2];
      component.checkForContextChange('category', [1]);
      expect(component.changeInContext['category']).toBe(true);
    });

    it(`should set changeInContext for category when category and idsForSelectedCategories are not same`, () => {
      component.idsForSelectedCategories = [1, 2];
      component.checkForContextChange('category', [1, 3]);
      expect(component.changeInContext['category']).toBe(true);
    });

    it(`should set changeInContext for manufacturers when manufacturers and projectInfo manufacturers length are not same`, () => {
      component.projectInfo = {
          manufacturers: [{id: 1}, {id: 2}]
      };
      component.checkForContextChange('manufacturers', [{id: 1}]);
      expect(component.changeInContext['manufacturers']).toBe(true);
    });

    it(`should set changeInContext for manufacturers when manufacturers and projectInfo manufacturers are not same`, () => {
      component.projectInfo = {
          manufacturers: [{id: 1}, {id: 2}, {id: 3}]
      };
      component.checkForContextChange('manufacturers', [{id: 1}, {id: 3}, {id: 4}]);
      expect(component.changeInContext['manufacturers']).toBe(true);
    });

    it(`should set changeInContext for manufacturers when manufacturers and projectInfo manufacturers are not same`, () => {
      component.projectInfo = {
          manufacturers: [{id: 3}, {id: 2}, {id: 4}]
      };
      component.checkForContextChange('manufacturers', [{id: 1}, {id: 3}, {id: 2}]);
      expect(component.changeInContext['manufacturers']).toBe(true);
    });

    it(`should set changeInContext for innovationTypes when innovationTypes and projectInfo innovationTypes length are not same`, () => {
      component.projectInfo = {
          innovationTypes: [[{id: 1}], [{id: 2}]]
      };
      component.checkForContextChange('innovationTypes', [[{id: 1}]]);
      expect(component.changeInContext['innovationTypes']).toBe(true);
    });

    it(`should set changeInContext for innovationTypes when innovationTypes and projectInfo innovationTypes are not same`, () => {
      component.projectInfo = {
          innovationTypes: [[{id: 1}], [{id: 2}], [{id: 3}]]
      };
      component.checkForContextChange('innovationTypes', [[{id: 1}], [{id: 3}], [{id: 4}]]);
      expect(component.changeInContext['innovationTypes']).toBe(true);
    });

    it(`should set changeInContext for innovationTypes when innovationTypes and projectInfo innovationTypes are not same`, () => {
      component.projectInfo = {
          innovationTypes: [[{id: 3}], [{id: 2}], [{id: 4}]]
      };
      component.checkForContextChange('innovationTypes', [[{id: 1}], [{id: 3}], [{id: 2}]]);
      expect(component.changeInContext['innovationTypes']).toBe(true);
    });

    it(`should set changeInContext for key when key is not match with projectInfo key`, () => {
      component.projectInfo = {
          factType: {id: 1}
      };
      component.checkForContextChange('factType', {id: 2});
      expect(component.changeInContext['factType']).toBe(true);
    });

    it(`should not set changeInContext for key when key is match with projectInfo key`, () => {
      component.projectInfo = {
          factType: {id: 1}
      };
      component.checkForContextChange('factType', {id: 1});
      expect(component.changeInContext['factType']).toBe(false);
    });

  });

  describe(`checkMandatoryFields`, () => {
    let spy;
    beforeEach(() => {
      spy = spyOn(component.enableApplyButton, 'emit');
    });
    it(`should disable Apply button when no categories selected`, () => {
      component.profilerContext = {
        categories: []
      };
      component.checkMandatoryFields();
      expect(spy).toHaveBeenCalledWith(false);
    });
    it(`should disable Apply button when no manufacturers selected`, () => {
      component.profilerContext = {
        manufacturers: []
      };
      component.checkMandatoryFields();
      expect(spy).toHaveBeenCalledWith(false);
    });
    it(`should disable Apply button when no innovationTypes selected`, () => {
      component.profilerContext = {
        innovationTypes: []
      };
      component.checkMandatoryFields();
      expect(spy).toHaveBeenCalledWith(false);
    });
  });


  describe('reset()', () => {
    let refactorTimePeriodSpy,
      refactorInnovationTypesSpy,
      refactorCategoriesSpy,
      refactorManufacturersSpy,
      resetChangeInContextSpy;

    beforeEach(fakeAsync(() => {
      const datasetMetadata = [...PROFILER['METADATA']['datasetMetadata']['1']];

      component['store'].dispatch({
        type: PROFILER_ACTIONS.GET_DATASET_METADATA_RESOLVED,
        payload: {
          data: datasetMetadata
        }
      });

      fixture.detectChanges();

      tick(1000);
      fixture.detectChanges();

      tick(1000);
    }));

    beforeEach(() => {
      refactorTimePeriodSpy = spyOn(component, 'refactorTimePeriod');
      refactorInnovationTypesSpy = spyOn(component, 'refactorInnovationTypes');
      refactorCategoriesSpy = spyOn(component, 'refactorCategories');
      refactorManufacturersSpy = spyOn(component, 'refactorManufacturers');
      resetChangeInContextSpy = spyOn(component, 'resetChangeInContext');

      component.reset();
    });

    it('Should call "refactorTimePeriod"', () => {
      expect(refactorTimePeriodSpy).toHaveBeenCalled();
    });

    it('Should call "refactorInnovationTypes"', () => {
      expect(refactorInnovationTypesSpy).toHaveBeenCalled();
    });

    it('Should call "refactorCategories"', () => {
      expect(refactorCategoriesSpy).toHaveBeenCalled();
    });

    it('Should call "refactorManufacturers"', () => {
      expect(refactorManufacturersSpy).toHaveBeenCalled();
    });

    it('Should call "resetChangeInContext"', () => {
      expect(resetChangeInContextSpy).toHaveBeenCalled();
    });

  });

  describe(`check sections with dropdowns`, () => {

    beforeEach(fakeAsync(() => {
      const datasetMetadata = [...PROFILER['METADATA']['datasetMetadata']['1']];

      component['store'].dispatch({
        type: PROFILER_ACTIONS.GET_DATASET_METADATA_RESOLVED,
        payload: {
          data: datasetMetadata
        }
      });

      fixture.detectChanges();

      tick(1000);
      fixture.detectChanges();

      tick(1000);

    }));

    it(`should have "Chart Data" section with drop-downs`, fakeAsync(() => {

      const element = fixture.nativeElement;
      const sectionHeader = element.querySelector('.section').querySelector('.section-header').innerHTML.toLowerCase();
      expect(sectionHeader).toContain(`chart data`);

      const sectionContent = element.querySelector('.section').querySelector('.section-content');
      let dropDownText = sectionContent.querySelector('#manufacturer').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText).toContain(`for manufacturers &amp; brands`);

      let dropDown = sectionContent.querySelector('#manufacturer').querySelector('ion-flat-paginated-multi-select');
      expect(dropDown).toBeTruthy();

      dropDownText = sectionContent.querySelector('#factType').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText).toContain(`with sales`);

      dropDown = sectionContent.querySelector('#factType').querySelector('nd-dropdown-menu');
      expect(dropDown).toBeTruthy();
    }));

    it(`should have "Scope" section with drop-downs`, fakeAsync(() => {

      tick(1000);

      const element = fixture.nativeElement;
      expect(element).toBeTruthy();

      const sectionHeader = element.querySelectorAll('.section')[1].querySelector('.section-header').innerHTML.toLowerCase();
      expect(sectionHeader).toContain(`scope`);

      const sectionContent = element.querySelectorAll('.section')[1].querySelector('.section-content');

      let dropDownText = sectionContent.querySelector('#category').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText.toLowerCase()).toContain(`For Category / Segment`.toLowerCase());

      let dropDown = sectionContent.querySelector('#category').querySelector('ion-multi-select');
      expect(dropDown).toBeTruthy();

      dropDownText = sectionContent.querySelector('#timePeriods').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText).toContain(`time period`);

      dropDown = sectionContent.querySelector('#timePeriods').querySelector('ion-time-period');
      expect(dropDown).toBeTruthy();

    }));

    it(`should have "Innovation Definition" section with drop-downs`, fakeAsync(() => {

      tick(1000);

      const element = fixture.nativeElement;
      expect(element).toBeTruthy();

      const sectionHeader = element.querySelectorAll('.section')[2].querySelector('.section-header').innerHTML.toLowerCase();
      expect(sectionHeader).toContain(`innovation definition`);

      const sectionContent = element.querySelectorAll('.section')[2].querySelector('.section-content');

      let dropDownText = sectionContent.querySelector('#innovationPeriods').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText).toContain(`consider innovation for`);

      let dropDown = sectionContent.querySelector('#innovationPeriods').querySelector('nd-dropdown-menu');
      expect(dropDown).toBeTruthy();

      dropDownText = sectionContent.querySelector('#innovationThresholds').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText).toContain(`from reaching`);

      dropDown = sectionContent.querySelector('#innovationThresholds').querySelector('nd-dropdown-menu');
      expect(dropDown).toBeTruthy();

      dropDownText = sectionContent.querySelector('#innovationTypes').querySelector('label').innerHTML.toLowerCase();
      expect(dropDownText).toContain(`innovation types`);

      dropDown = sectionContent.querySelector('#innovationTypes').querySelector('ion-multi-select');
      expect(dropDown).toBeTruthy();
    }));

    it(`should submit and pass data to store`, () => {
      const mockData = {
        profilerContext: 123,
      };

      const changeInContext = {
        manufacturers: true,
        factType: false,
        category: false,
        timePeriod: false,
        innovationPeriods: false,
        innovationThresholds: false,
        innovationTypes: false
      };

      spyOn(component.updateMetadataDefaults, 'emit');
      component.profilerContext = mockData.profilerContext;
      component.changeInContext = changeInContext;
      component.onSubmit();
      expect(component.updateMetadataDefaults.emit).toHaveBeenCalledWith(mockData.profilerContext);
    });

    it(`should set timePeriod to be 'undefined' when the list is empty`, () => {

      component.profilerContext = Object.assign({}, component.projectInfo);
      component.datasetMetadata = { periods: [] };

      component.onSelection('timePeriod', '2017');
      expect(component.profilerContext.timePeriod).toBe(undefined);
    });

    it(`should set timePeriod to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      component.onSelection('timePeriod', '4');
      expect(component.profilerContext.timePeriod.id).toBe('4');
    });

    it(`should set innovationPeriod to be 'undefined' when the list is empty`, () => {

      component.profilerContext = Object.assign({}, component.projectInfo);
      component.datasetMetadata = { innovationPeriods: [] };

      component.onSelection('innovationPeriod', { target: { selected: '1' } });
      expect(component.profilerContext.innovationPeriod).toBe(undefined);
    });

    it(`should set innovationPeriod to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      component.onSelection('innovationPeriods', { target: { selected: '1' } });
      expect(component.profilerContext.innovationPeriod.id).toBe('1');
    });



    it(`should set category/segment to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      const selected = [[{ label: 'RAZORS & BLADES', value: '1234' }, { label: 'RAZOR', value: '2' }]];
      component.onSelection('category', selected);
      expect(component.selectedCategories).toBe(selected);
    });


    it(`should set manufacturers/brands to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      const selected = [{ label: '2T WATER', value: '102110759', groupTag: 'MFR' },
      { label: '3 SPRINGS WATER COMPANY', value: '102108739', groupTag: 'MFR' }];
      component.onSelection('manufacturers', selected);
      expect(component.selectedManufacturers).toBe(selected);
    });

    it(`should set innovationTypes to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      const event = component.datasetMetadata.innovationTypes
        .map((item) => {
          return [{ label: item.name, value: item.id }];
        });
      component.onSelection('innovationTypes', event);
      expect(component.profilerContext.innovationTypes.length).toBe(event.length);
    });

    it(`should have flat list for innovationTypes`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      const mockData = [
        [{ label: 'NEW SUB-BRAND', value: '1' },
        { label: 'NEW SUB-BRAND', value: '2' }],
        [{ label: 'LINE EXTENSION', value: '3' }]
      ];
      component.onSelection('innovationTypes', mockData);
      expect(component.profilerContext.innovationTypes.length).toBe(2);
    });

    it(`should set factType to be 'undefined' when the list is empty`, () => {

      component.profilerContext = Object.assign({}, component.projectInfo);
      component.datasetMetadata = { factTypes: [] };

      component.onSelection('factType', { target: { selected: '1' } });
      expect(component.profilerContext.factType).toBe(undefined);
    });

    it(`should set factType to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      component.onSelection('factTypes', { target: { selected: '1' } });
      expect(component.profilerContext.factType.id).toBe('1');
    });

    it(`should set innovationThreshold to be 'undefined' when the list is empty`, () => {

      component.profilerContext = Object.assign({}, component.projectInfo);
      component.datasetMetadata = { innovationThresholds: [] };

      component.onSelection('innovationThresholds', { target: { selected: '1' } });
      expect(component.profilerContext.innovationThreshold).toBe(undefined);
    });

    it(`should set innovationThreshold to be the selected value`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      component.onSelection('innovationThresholds', { target: { selected: '1' } });
      expect(component.profilerContext.innovationThreshold.id).toBe('1');
    });

    it(`should have default value for drop-downs`, () => {
      expect(component.projectInfo.innovationThreshold.id).toBe('1');
      expect(component.projectInfo.innovationPeriod.id).toBe('1');
      expect(component.projectInfo.innovationTypes.length).toBe(4);
      expect(component.projectInfo.timePeriod.id).toBe('4');
      expect(component.projectInfo.factType.id).toBe('1');
      expect(component.projectInfo.categories[0][0].id).toBe('54763895');
      expect(component.projectInfo.manufacturers.length).toBe(4);
    });

    it(`should refactor time period data`, () => {
      expect(component.timePeriods[component.periodLevels['Period_Group_Level']].length).toBe(1);
    });

    // TODO : test case has to be added after method correction

    // it('Should refactor categories', () => {
    //   const mockData = [
    //     {
    //     name: 'Level 1 - 1',
    //     id: '1',
    //     items: [
    //       {
    //       name: 'Level 2 - 1',
    //       id: '3'
    //       },

    //       {
    //       name: 'Level 2 - 3',
    //       id: '5'
    //       }
    //   ]}];
    //   let result = [
    //     [{label: 'Level 1 - 1', value: '1'}, { label :'Level 2 - 1', value: '3'}], // for "Level 2 - 1"
    //     [{label: 'Level 1 - 1', value: '1'}, { label :'Level 2 - 3', value: '5'}] // for "Level 2 - 3"
    //   ];

    //   component.datasetMetadata.categories = mockData;
    //   component.refactorCategories();
    //   // expect(component.categories[component.periodLevels['Period_Group_Level']].length).toBe(1);
    //   // expect(component.categories[component.periodLevels['Year_Level']].length).toBe(5);
    //   expect(component.categories).toBe(result);
    // });
    it(`should sort given hierarchical list alphabetically`, () => {
      const mockData = [{ 'label': 'India' }, { 'label': 'Japan' }, { 'label': 'Arabia' }, { 'label': 'Italy' }];
      const items = component.sortItems(mockData);
      expect(items).toBe(mockData);
    });

    it(`should sort categories in ascending order`, () => {
      component.categorySegDisplay.featureEnabled = true;
      component.refactorCategories();
      expect(component.categories[0].items[0].value).toBe('48646655');
      expect(component.categories[0].items[1].value).toBe('48646657');
      expect(component.categories[0].items[2].value).toBe('48646658');
    });

    it(`should sort innovationTypes in ascending order`, () => {
      expect(component.innovationTypes.allValues[0].value).toBe('-1170661728');
      expect(component.innovationTypes.allValues[1].value).toBe('-1170661726');
      expect(component.innovationTypes.allValues[2].value).toBe('-1170661725');
    });

    it(`should display selected brands/manufacturers with respective abbreviation`, () => {
      component.profilerContext = Object.assign({}, component.projectInfo);
      const selected = [
        { label: 'BIC 3', value: '54756197', groupTag: 'MFR' },
        { label: 'BIC 3', value: '547561971', groupTag: 'BRD' },
        { label: 'BIC 3', value: '5475619711', groupTag: 'SUB-BR' }
      ];
      component.onSelection('manufacturers', selected);
      expect(component.selectedManufacturers[0].groupTag).toBe('MFR');
      expect(component.selectedManufacturers[1].groupTag).toBe('BRD');
      expect(component.selectedManufacturers[2].groupTag).toBe('SUB-BR');
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
        const element = fixture.nativeElement.querySelector('.section');
        expect(element).toBeTruthy();
      }));

      it(`should call utils sort method on manufacturer dropdown`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        const sort = spyOn(component, 'sortItems');
        component.refactorManufacturers();
        expect(spy).toHaveBeenCalled();
      });

      it(`should call utils sort method on innovation type dropdown`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        component.refactorInnovationTypes();
        expect(spy).toHaveBeenCalled();
      });

      it(`should call utils sort method on categories dropdown`, () => {
        const spy = spyOn<any>(Utils, 'convertInTitle');
        const sort = spyOn(component, 'sortItems');
        component.refactorManufacturers();
        expect(spy).toHaveBeenCalled();
      });

      it(`should display selected brands/manufacturers in CAPS`, () => {
        component.profilerContext = Object.assign({}, component.projectInfo);
        const selected = [
          { label: 'BIC 3', value: '54756197', groupTag: 'MFR' },
        ];
        component.onSelection('manufacturers', selected);
        expect(component.selectedManufacturers[0].groupTag).toBe('MFR');

      });

    });
  });
});

