import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {HelpMessageComponent} from './help-message.component';
import {UnitTestingModule} from '../../../unit-testing.module';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';


describe('HelpMessageComponent', () => {
  let component: HelpMessageComponent;
  let fixture: ComponentFixture<HelpMessageComponent>;

  let app;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpMessageComponent],
      imports: [RouterTestingModule, UnitTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpMessageComponent);
    component = fixture.componentInstance;

    app = fixture.debugElement.componentInstance;

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

});
