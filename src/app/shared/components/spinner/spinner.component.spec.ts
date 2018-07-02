import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {SpinnerComponent} from './spinner.component';
import {UnitTestingModule} from '../../../unit-testing.module';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  template: `<ion-spinner [isPageLoading]="isPageLoading"></ion-spinner>`
})
class SpinnerWrapperComponent {
  isaPageLoading = true;
  icon = 'ion:profiler';
  actionTitle = 'LOADING YOUR PROFILER DATA.';
}

describe('SpinnerComponent', () => {
  let component: SpinnerWrapperComponent;
  let fixture: ComponentFixture<SpinnerWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerComponent, SpinnerWrapperComponent],
      imports: [RouterTestingModule, UnitTestingModule],
     schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerWrapperComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });
  it(`should have spinner container`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.spinner-container');
    expect(element).toBeTruthy();

  });
  it(`should have help message container inside component`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('ion-help-message');
    expect(element).toBeTruthy();

  });
  it(`should have loader icon`, () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('nd-spinner-lite');
    expect(element).toBeTruthy();

  });

});
