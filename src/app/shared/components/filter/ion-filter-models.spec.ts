import { Entry, FilterModel, GridFilter } from './ion-filter-models';

describe('FilterModels', () => {

    describe('"Entry" Model', () => {
        let model: Entry;
        beforeEach(() => {
            model = new Entry('HYD', 'Hyderabad', 'Hyd');
        });
        it('defaults', () => {
            expect(model.visible).toBeTruthy();
            expect(model.selected).toBeTruthy();
        });

        it('Should not set "shortLabel" if it is not passed in constructor', () => {
            model = new Entry('HYD', 'Hyderabad');
            expect(model.shortLabel).toBeUndefined();
        });
    });

    describe('"FilterModel" Model', () => {
        let model: FilterModel;
        beforeEach(() => {
            const items = [];
            items.push(new Entry('HYD', 'Hyderabad'));
            items.push(new Entry('SCB', 'Secunderbad'));
            items.push(new Entry('MUM', 'Mumbai'));
            model.items = items;
        });
        model = new FilterModel('city');
        it('defaults', () => {
            expect(model.selectedAll).toBeTruthy();
            expect(model.filtered).toBeFalsy();
        });

        describe('update()', () => {
            beforeEach(() => {
            });
            describe('When all items are selected (default state not filtered)', () => {
                beforeEach(() => {
                    model.update();
                });
                it('Should set "unselectedValues" to "[]"', () => {
                    expect(model.unselectedValues).toEqual([]);
                });
                it('Should set "filtered" to "false"', () => {
                    expect(model.filtered).toBeFalsy();
                });
            });
            describe('When partial items are selected but all items are visible', () => {
                beforeEach(() => {
                    model.items[1].selected = false;
                    model.update();
                });
                it('Should set "unselectedValues"', () => {
                    expect(model.unselectedValues).toEqual(['SCB']);
                });
                it('Should set "filtered" to "true"', () => {
                    expect(model.filtered).toBeTruthy();
                });
            });
            describe('When partial items are selected and partial all items are visible', () => {
                beforeEach(() => {
                    model.items[0].selected = false;
                    model.items[0].visible = false;
                    model.items[2].selected = false;
                    model.update();
                });
                it('Should set "unselectedValues"', () => {
                    expect(model.unselectedValues).toEqual(['MUM']);
                });
                it('Should ignore the unselected values if they are not visible', () => {
                    expect(model.unselectedValues.indexOf('HYD')).toBe(-1);
                });
                it('Should set "filtered" to "true"', () => {
                    expect(model.filtered).toBeTruthy();
                });
            });
        });

        describe('setVisibleItems(values)', () => {
            beforeEach(() => { });
            describe('When All items are selected (Default state)', () => {

                it('Should update "visible" property for respective items', () => {
                    model.setVisibleItems(['MUM', 'HYD']);
                    expect(model.items.filter(e => e.visible).map(e => e.label)).toEqual(['Hyderabad', 'Mumbai']);
                });
            });
            describe('When partial items are selected', () => {
                beforeEach(() => {
                    model.items[1].selected = false;
                    model.items[2].visible = false;
                    model.update();
                });
                it('Should update "visible" property for respective items', () => {
                    model.setVisibleItems(['SCB', 'MUM']);
                    expect(model.items.filter(e => e.visible).map(e => e.label)).toEqual(['Secunderbad', 'Mumbai']);
                });
            });
        });
    });

    describe('"GridFilter" Model', () => {
        let model: GridFilter;
        beforeEach(() => {
            model = new GridFilter(['city', 'state']);
        });

        describe('Defaults', () => {
            it('Should populate "_keys"', () => {
                expect(model['_keys']).toEqual(['city', 'state']);
            });

            it('Should create respective FilterModels', () => {
                expect(model.filters.length).toBe(2);
            });

            it('Should create "models" map with given keys', () => {
                expect(Object.keys(model.models)).toEqual(['city', 'state']);
            });
        });

        describe('updateRelativeModels()', () => {
            beforeEach(() => {
                model.filters[0].items = [new Entry('HYD', 'Hyderabad'),
                new Entry('VSKP', 'Visakhapatnam'),
                new Entry('RJY', 'Rajahmundry'),
                new Entry('VJA', 'Vijayawada')
                ];
                model.filters[1].items = [new Entry('TL', 'Telangana'), new Entry('AP', 'Andhra Pradesh')];
            });

            it('Should update relative Filter Models', () => {
                // selecting the "state" as current filter
                const currentFilter = model.filters[1];
                const items = [{ 'city': 'HYD', state: 'TL' }, { 'city': 'VSKP', state: 'AP' }];
                model.updateRelativeModels(currentFilter, items);
                expect(model.filters[0].items.filter(e => e.visible).map(e => e.label)).toEqual(['Hyderabad', 'Visakhapatnam']);
            });
        });
    });

});
