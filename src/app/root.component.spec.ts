import { TestBed, async } from '@angular/core/testing';
import { UnitTestingModule } from './unit-testing.module';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RootComponent } from './root.component';
import { Store, StoreModule } from '@ngrx/store';

@Component({
  selector: 'ion-test',
  template: 'test'
})
class TestComponent {}

const defaultState = {
  name: 'test',
};

const testReducers = {
  TEST_REDUCER: (state = defaultState) => {
    return state;
  },
};


describe('RootComponent', () => {
  let component;
  let fixture;
  let store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent ],
      imports: [
        UnitTestingModule,
        StoreModule.forFeature('TEST_FEATURE', testReducers),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    store = fixture.debugElement.injector.get(Store);

  }));

  beforeEach(() => {
    component = new RootComponent();
  });

  it('should initialize component', async(() => {
    expect(component).toBeTruthy();
    expect(Array.isArray(component.subscriptions)).toBe(true);
    expect(component.subscriptions.length).toBe(0);
  }));

  describe('Method: ngOnDestroy', () => {
    it('should unsubscribe subscriptions: 0 subscriptions', () => {
      const subscriptions = [];
      component.subscriptions = subscriptions;
      component.ngOnDestroy();
      // array reference should change
      expect(component.subscriptions).not.toBe(subscriptions);
    });

    it('should unsubscribe subscriptions: multiple subscriptions', () => {
      const subscriptions = [{
        unsubscribe: () => {},
      }]; // mock
      component.subscriptions = subscriptions;
      spyOn(subscriptions[0], 'unsubscribe');
      component.ngOnDestroy();

      // subscriptions must be array and empty
      expect(Array.isArray(component.subscriptions)).toBe(true);
      expect(component.subscriptions.length).toBe(0);

      // unsubscribe() method is called
      expect(subscriptions[0].unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe subscriptions: null checks for subscriptions', () => {
      // subscription is null
      const subscriptions = [null];

      component.subscriptions = subscriptions;
      component.ngOnDestroy();

      // subscriptions must be array and empty
      expect(Array.isArray(component.subscriptions)).toBe(true);
      expect(component.subscriptions.length).toBe(0);
    });
  });



  describe('Method: subscribe', () => {
    it('should subscribe and callback success data', () => {
      // inputs
      const inputs = {
        store,
        feature: 'TEST_FEATURE',
        reducer: 'TEST_REDUCER',
        state: 'name',
      };
      const callbacks = {
        onSuccess: () => {},
      };

      spyOn(callbacks, 'onSuccess');
      component.subscribe(inputs, callbacks.onSuccess);

      expect(callbacks.onSuccess).toHaveBeenCalledWith(defaultState.name);
      expect(component.subscriptions.length).toBe(1);
    });


    it('should subscribe and handle errors of success callback', () => {
      // inputs
      const inputs = {
        store,
        feature: 'TEST_FEATURE',
        reducer: 'TEST_REDUCER',
        state: 'name',
      };
      const err = new Error('Custom error');
      const callbacks = {
        onSuccess: () => {
          throw err;
        },
        onError: () => {},
      };

      spyOn(callbacks, 'onError');
      component.subscribe(inputs, callbacks.onSuccess, callbacks.onError);

      expect(callbacks.onError).toHaveBeenCalledWith(err);
      expect(component.subscriptions.length).toBe(1);
    });
  });

});
