import { ViewSwitchDirective } from './view-switch.directive';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UnitTestingModule } from '../../../unit-testing.module';
import { ArrayUtils } from '../../utils/array-utils';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ContentChild, ViewChild } from '@angular/core';
import { LANDING_PAGE_MOCK } from '../../mockdata/landing.page.mockdata';
import { DATA_STATE } from '../../../_store/data-states';
import { ViewResolvingDirective } from './view-resolving.directive';
import { ViewResolvedDirective } from './view-resolved.directive';
import { ViewErrorDirective } from './view-error.directive';
import { ViewEmptyDirective } from './view-empty.directive';

@Component({
  template: `
  <div [ionViewSwitch]="dataState" #view>
    <div *ionViewResolved>Resolved</div>
    <div *ionViewResolving>Resolving</div>
    <div *ionViewError>Error</div>
    <div *ionViewEmpty>Empty</div>
    <div *ionViewInvalid>Invalid</div>
  </div>
  `
})
class ViewSwitchWrapperComponent {
  @ViewChild(ViewSwitchDirective) view: ViewSwitchDirective;
  dataState = DATA_STATE.RESOLVING;
}

describe('ViewSwitchDirective', () => {
  let component: ViewSwitchWrapperComponent;
  let fixture: ComponentFixture<ViewSwitchWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewSwitchDirective,
        ViewResolvedDirective,
        ViewResolvingDirective,
        ViewErrorDirective,
        ViewEmptyDirective,
        ViewSwitchWrapperComponent
      ],
      imports: [UnitTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSwitchWrapperComponent);
    component = fixture.componentInstance;
  });

  it(`should create an instance`, () => {
    const directive = new ViewSwitchDirective();
    expect(directive).toBeTruthy();
  });

  it(`should call 'setViewState' method`, fakeAsync(() => {
    const spy = spyOn<any>(component.view, 'setViewState');
    fixture.detectChanges();
    tick(100);
    expect(spy).toHaveBeenCalled();
  }));


  it(`should show resolved component when state is 'resolved'`, fakeAsync(() => {
    fixture.detectChanges();
    component.dataState = DATA_STATE.RESOLVED;
    fixture.detectChanges();
    tick(100);
    expect(fixture.nativeElement.querySelector('div').innerText).toBe('Resolved');
  }));

  it(`should show resolving component when state is 'resolving'`, fakeAsync(() => {
    fixture.detectChanges();
    component.dataState = DATA_STATE.RESOLVING;
    fixture.detectChanges();
    tick(100);
    expect(fixture.nativeElement.querySelector('div').innerText).toBe('Resolving');
  }));

  it(`should show error component when state is 'error'`, fakeAsync(() => {
    fixture.detectChanges();
    component.dataState = DATA_STATE.ERROR;
    fixture.detectChanges();
    tick(100);
    expect(fixture.nativeElement.querySelector('div').innerText).toBe('Error');
  }));

  it(`should show empty component when state is 'empty'`, fakeAsync(() => {
    fixture.detectChanges();
    component.dataState = DATA_STATE.EMPTY;
    fixture.detectChanges();
    tick(100);
    expect(fixture.nativeElement.querySelector('div').innerText).toBe('Empty');
  }));

  describe('setViewState()', () => {

    it(`should call 'setResolving'`, fakeAsync(() => {
      fixture.detectChanges();
      component.view['setViewState']();
      const spy = spyOn<any>(component.view, 'setResolving');
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it(`should call 'setResolved'`, fakeAsync(() => {
      fixture.detectChanges();
      component.view['setViewState']();
      const spy = spyOn<any>(component.view, 'setResolved');
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it(`should call 'setError'`, fakeAsync(() => {
      fixture.detectChanges();
      component.view['setViewState']();
      const spy = spyOn<any>(component.view, 'setError');
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it(`should call 'setEmpty'`, fakeAsync(() => {
      fixture.detectChanges();
      component.view['setViewState']();
      const spy = spyOn<any>(component.view, 'setEmpty');
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

    it(`should call 'setInvalid'`, fakeAsync(() => {
      fixture.detectChanges();
      component.view['setViewState']();
      const spy = spyOn<any>(component.view, 'setInvalid');
      tick(1000);
      expect(spy).toHaveBeenCalled();
    }));

  });
});
