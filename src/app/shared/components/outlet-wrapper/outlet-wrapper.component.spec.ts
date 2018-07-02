import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletWrapperComponent } from './outlet-wrapper.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('OutletWrapperComponent', () => {
  let component: OutletWrapperComponent;
  let fixture: ComponentFixture<OutletWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OutletWrapperComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
