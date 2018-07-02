/**
 * This class represents a single item in filter list
 */
export class Entry {
    visible = true;
    selected = true;
    constructor(public value, public label, public shortLabel?: string) { }
}

/**
 * Represents a single filter model
 */
export class FilterModel {
    filtered = false;
    items: Array<Entry> = [];
    unselectedValues = [];
    selectedAll = true;

    constructor(public key: string) { }

    update() {
        this.unselectedValues = this.items.filter(e => !e.selected && e.visible).map(e => e.value);
        this.selectedAll = this.unselectedValues.length === 0;
        this.filtered = !this.selectedAll;
    }

    setVisibleItems(values: Array<any>) {
        if (this.selectedAll) {
            this.items.forEach(e => { e.visible = values.indexOf(e.value) !== -1; });
        } else {
            this.items
                .filter(e => !e.visible || e.selected)
                .forEach(e => { e.visible = values.indexOf(e.value) !== -1; });
        }
    }
}

export class GridFilter {
    private _keys: Array<string> = [];
    readonly models: { [key: string]: FilterModel } = {};
    readonly filters: Array<FilterModel> = [];

    constructor(keys: Array<string>) {
        this._keys = keys;
        keys.forEach(key => {
            this.models[key] = new FilterModel(key);
        });
        this.filters = Object.keys(this.models).map(item => this.models[item]);
    }

    updateRelativeModels(currentModel: FilterModel, items: Array<any>, ) {
        const tempMap = {};
        for (const key of this._keys) {
            if (currentModel.key !== key) {
                tempMap[key] = new Set();
            }
        }

        items.forEach(e => {
            for (const key of this._keys) {
                if (currentModel.key !== key) {
                    tempMap[key].add(e[key]);
                }
            }
        });
        this._keys.forEach((key) => {
            if (currentModel.key !== key) {
                this.models[key].setVisibleItems(Array.from(tempMap[key]));
            }
        });
    }
}
