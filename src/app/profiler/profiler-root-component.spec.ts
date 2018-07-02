import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';

import { ProfilerRootComponent } from './profiler-root-component';
import { FEATURE } from '../features';
import { UnitTestingModule } from '../unit-testing.module';
import { ProfilerContextService } from './profiler-context-service';
import { APP_REDUCERS } from '../_store/app-reducers';
import { RootComponent } from '../root.component';
import { profilerReducers } from './_store/profiler-reducers';
import { PROFILER_ACTIONS } from './_store/profiler-actions';

@Component({
    selector: 'ion-test',
    template: 'test'
})
class TestComponent extends ProfilerRootComponent {
    constructor() {
        super(null, null);
    }
}

describe('ProfilerRootComponent', () => {
    let component: ProfilerRootComponent;
    let fixture: ComponentFixture<ProfilerRootComponent>;
    let store: Store<any>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TestComponent],
            imports: [
                UnitTestingModule,
                StoreModule.forFeature(FEATURE.PROFILER, profilerReducers),
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        store = fixture.debugElement.injector.get(Store);
        component['store'] = store;
        component['profilerContextService'] = new ProfilerContextService(store);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component['store']).toBeDefined();
    });

    it('should subscribe for "App profilerContext" on init', () => {
        spyOn(RootComponent.prototype, 'subscribe');
        component.ngOnInit();
        expect(component.subscribe).toHaveBeenCalled();
    });

    it('should call "retryContext" of context service when "refreshContext" is being called', () => {
        const contextSpy = spyOn(component['profilerContextService'], 'retryContext');
        component.refreshContext();
        expect(contextSpy).toHaveBeenCalled();
    });

    it('should call "setProfilerRelatedContextToError" when profiler context resolved as "ERROR"', () => {
        const setProfilerRelatedContextToErrorSpy = spyOn(component, 'setProfilerRelatedContextToError');
        store.dispatch({
            type: PROFILER_ACTIONS.UPSERT_PROFILER_CONTEXT_ERROR,
            payload: { data: {} }
        });
        fixture.detectChanges();
        expect(setProfilerRelatedContextToErrorSpy).toHaveBeenCalled();
    });

    describe('setProfilerRelatedContextToError', () => {
        let storeDispatchSpy;
        const payload = { data: {} };

        beforeEach(() => {
            storeDispatchSpy = spyOn(store, 'dispatch');
            component.setProfilerRelatedContextToError();
        });

        it('should call "GET_MARKET_SHARE_ERROR"', () => {
            expect(storeDispatchSpy).toHaveBeenCalledWith({ type: PROFILER_ACTIONS.GET_MARKET_SHARE_ERROR, payload });
        });

        it('should call "GET_INNOVATION_ITEMS_ERROR"', () => {
            expect(storeDispatchSpy).toHaveBeenCalledWith({ type: PROFILER_ACTIONS.GET_INNOVATION_ITEMS_ERROR, payload });
        });

        it('should call "GET_INNOVATION_CHARACTERISTICS_ERROR"', () => {
            expect(storeDispatchSpy).toHaveBeenCalledWith({ type: PROFILER_ACTIONS.GET_INNOVATION_CHARACTERISTICS_ERROR, payload });
        });

        it('should call "GET_LX_SUBTYPES_ERROR"', () => {
            expect(storeDispatchSpy).toHaveBeenCalledWith({ type: PROFILER_ACTIONS.GET_LX_SUBTYPES_ERROR, payload });
        });

        it('should call "GET_INNOVATION_TYPE_ERROR"', () => {
            expect(storeDispatchSpy).toHaveBeenCalledWith({ type: PROFILER_ACTIONS.GET_INNOVATION_TYPE_ERROR, payload });
        });

        it('should call "GET_ITEM_DETAILS_ERROR"', () => {
            expect(storeDispatchSpy).toHaveBeenCalledWith({ type: PROFILER_ACTIONS.GET_ITEM_DETAILS_ERROR, payload });
        });
    });

});
