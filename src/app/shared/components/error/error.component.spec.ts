import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UnitTestingModule } from '../../../unit-testing.module';
import { ArrayUtils } from '../../utils/array-utils';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ContentChild, ViewChild } from '@angular/core';
import { DATA_STATE } from '../../../_store/data-states';
import { ErrorComponent } from './error.component';
import { ViewSwitchDirective } from '../../directives/view-switch/view-switch.directive';
import { ViewResolvedDirective } from '../../directives/view-switch/view-resolved.directive';
import { ViewResolvingDirective } from '../../directives/view-switch/view-resolving.directive';
import { ViewErrorDirective } from '../../directives/view-switch/view-error.directive';
import { ViewEmptyDirective } from '../../directives/view-switch/view-empty.directive';

@Component({
  template: `
  <ion-error [errorCode]="errorCode" [errorMessage]='errorMessage'
  [action]="action" [actions]="actions" (onAction)="onAction($event)" #view></ion-error>
  `
})
class ErrorWrapperComponent {
  @ViewChild(ErrorComponent) view: ErrorComponent;
  errorCode: any;
  errorMessage: string;
  actions: Array<string>;
  action;

  onAction(action) {
  }
}
describe('ErrorComponent', () => {
  let component: ErrorWrapperComponent;
  let fixture: ComponentFixture<ErrorWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent,
        ViewSwitchDirective,
        ViewResolvedDirective,
        ViewResolvingDirective,
        ViewErrorDirective,
        ViewEmptyDirective, ErrorWrapperComponent],
      imports: [UnitTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call displayMessage on component load', fakeAsync(() => {
    const spy = spyOn(component.view, 'displayMessage');
    fixture.detectChanges();
    tick(100);
    expect(spy).toHaveBeenCalled();
  }));

  it('should show single action button', fakeAsync(() => {
    component.action = 'Action 1';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('nd-button');
    expect(button).toBeDefined();
  }));

  it('should show multiple action buttons', fakeAsync(() => {
    component.actions = ['Action 1', 'Action 2', 'Action 3'];
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('nd-button');
    expect(buttons.length).toBe(3);
  }));

  it('should give priority to "actions" attribute if both attributes "action" and "actions" present', fakeAsync(() => {
    component.actions = ['Action 1', 'Action 2', 'Action 3'];
    component.action = 'Action 4';
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('nd-button');
    expect(buttons.length).toBe(3);
  }));

  describe('Testing action callback', () => {
    let onActionSpy;
    beforeEach(() => {
      component.actions = ['Action 1', 'Action 2', 'Action 3'];
      onActionSpy = spyOn(component, 'onAction');
    });

    it('should be called with "Action 2" when clicking on 2nd button', fakeAsync(() => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('nd-button');
      buttons[1].click();
      fixture.detectChanges();
      expect(onActionSpy).toHaveBeenCalledWith('Action 2');
    }));

    it('should be called with "Action 3" when clicking on 3rd button', fakeAsync(() => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('nd-button');
      buttons[2].click();
      fixture.detectChanges();
      expect(onActionSpy).toHaveBeenCalledWith('Action 3');
    }));

    it('should be called with "Action 1" when clicking on 1st button', fakeAsync(() => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('nd-button');
      buttons[0].click();
      fixture.detectChanges();
      expect(onActionSpy).toHaveBeenCalledWith('Action 1');
    }));
  });

  describe('Testing functionality of displayMessage function', () => {
    it('if error message is available display that message', fakeAsync(() => {
      const message = 'Images not available for this item';
      component.errorMessage = 'Images not available for this item';
      fixture.detectChanges();
      tick(1000);
      expect(fixture.nativeElement.querySelector('nd-toast').getAttribute('text')).toBe(message);
    }));

    it('should show information toast message if it is empty message', fakeAsync(() => {
      const message = 'Images not available for this item';
      component.errorMessage = 'Images not available for this item';
      fixture.detectChanges();
      tick(1000);
      const infoToast = fixture.nativeElement.querySelector('nd-toast').getAttribute('info');
      expect(infoToast).not.toBe(null);
    }));

    it('should show error toast message if it is not empty message', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      const errorToast = fixture.nativeElement.querySelector('nd-toast').getAttribute('error');
      expect(errorToast).not.toBe(null);
    }));


    describe('if error code is available compute it and disply message accordingly', () => {
      it('checking default error message', () => {
        component.errorCode = 204;
        fixture.detectChanges();
        expect(component.view.errorMessage)
          .toBe('Unable to connect to Nielsen. Refresh your page or contact your Nielsen representative if the problem persists.');
      });

      // These tests are not valid as error component now shows only default message
      // for all scenarios.

      // xit('checking 504 error message', () => {
      //   component.errorCode = 504;
      //   fixture.detectChanges();
      //   expect(fixture.nativeElement.querySelector('div').innerText)
      //   .toBe('It seems like network is slow please refresh your page or try again later.');
      // });
      // xit('checking 500 error message', () => {
      //   component.errorCode = 500;
      //   fixture.detectChanges();
      //   expect(fixture.nativeElement.querySelector('div').innerText)
      //   .toBe('It seems like server is not responding correctly, Please contact Nielsen service desk.');
      // });
      // xit('checking 404 error message', () => {
      //   component.errorCode = 404;
      //   fixture.detectChanges();
      //   expect(fixture.nativeElement.querySelector('div').innerText)
      //   .toBe('Unfortunately requested data could not be resolved, Please contact Nielsen service desk.');
      // });
      // xit('checking 401 error message', () => {
      //   component.errorCode = 401;
      //   fixture.detectChanges();
      //   expect(fixture.nativeElement.querySelector('div').innerText)
      //   .toBe('User is not authorized to view this page, Please contact Nielsen service desk to get permissions.');
      // });

    });

  });
});
