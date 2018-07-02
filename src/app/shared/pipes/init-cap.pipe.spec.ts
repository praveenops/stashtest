import { Pipe, PipeTransform } from '@angular/core';
import { InitcapsPipe } from './init-cap.pipe';

describe('Pipe: InitcapsPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new InitcapsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should format string to Init Cap', () => {
    expect(pipe.transform('angular js')).toBe('Angular Js');
    expect(pipe.transform('Camel cAsE')).toBe('Camel Case');
    expect(pipe.transform('A ')).toBe('A ');
    expect(pipe.transform('a')).toBe('A');
  });

  it('null should be null', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('empty string should be empty', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(' ')).toBe(' ');
  });

});
