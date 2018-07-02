
import { OrdinalDate } from './ordinal-date.pipe';

describe('Pipe: OrdinalDate', () => {
  let pipe;

  beforeEach(() => {
    pipe = new OrdinalDate();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('defaults', () => {
    it('validate "SUPPORTED_FORMATS"', () => {
      expect(pipe['SUPPORTED_FORMATS'][0]).toBe('monthFirst');
      expect(pipe['SUPPORTED_FORMATS'][1]).toBe('dayFirst');
    });
  });

  describe('transform(value,format)', () => {
    let format;
    describe('with format "monthFirst"', () => {
      beforeEach(() => {
        format = 'monthFirst';
      });

      it('Should format the date', () => {
        expect(pipe.transform('2017-02-18 00:00:00', format)).toBe('February 18th 2017');
        expect(pipe.transform('2017-02-22 00:00:00', format)).toBe('February 22nd 2017');
        expect(pipe.transform('2017-02-21 00:00:00', format)).toBe('February 21st 2017');
        expect(pipe.transform('2017-02-03 00:00:00', format)).toBe('February 3rd 2017');
      });

      it('Should format the date with out time value', () => {
        expect(pipe.transform('2017-02-18', format)).toBe('February 18th 2017');
        expect(pipe.transform('2017-02-22', format)).toBe('February 22nd 2017');
        expect(pipe.transform('2017-02-21', format)).toBe('February 21st 2017');
        expect(pipe.transform('2017-02-03', format)).toBe('February 3rd 2017');
      });
    });

    describe('with format "dayFirst"', () => {
      beforeEach(() => {
        format = 'dayFirst';
      });

      it('Should format the date', () => {
        expect(pipe.transform('2017-02-18 00:00:00', format)).toBe('18 February 2017');
        expect(pipe.transform('2017-02-22 00:00:00', format)).toBe('22 February 2017');
        expect(pipe.transform('2017-02-21 00:00:00', format)).toBe('21 February 2017');
        expect(pipe.transform('2017-02-03 00:00:00', format)).toBe('03 February 2017');
      });

      it('Should format the date with out time value', () => {
        expect(pipe.transform('2017-02-18', format)).toBe('18 February 2017');
        expect(pipe.transform('2017-02-22', format)).toBe('22 February 2017');
        expect(pipe.transform('2017-02-21', format)).toBe('21 February 2017');
        expect(pipe.transform('2017-02-03', format)).toBe('03 February 2017');
      });

      it('Should prefix "0" infront of day if the day is between 1 to 9', () => {
        expect(pipe.transform('2017-02-1', format)).toBe('01 February 2017');
        expect(pipe.transform('2017-02-9', format)).toBe('09 February 2017');
      });
    });

    it('Should return "undefined" when called with unknow format', () => {
      expect(pipe.transform('2017-02-18 00:00:00', 'long')).toBeUndefined();
      expect(pipe.transform('2017-02-22 00:00:00', 'short')).toBeUndefined();
      expect(pipe.transform('2017-02-21 00:00:00', 'format1')).toBeUndefined();
      expect(pipe.transform('2017-02-03 00:00:00', '')).toBeUndefined();
    });

    it('Default format should be "monthFirst" if not passed', () => {
      expect(pipe.transform('2017-02-18 00:00:00')).toBe('February 18th 2017');
      expect(pipe.transform('2017-02-22 00:00:00')).toBe('February 22nd 2017');
      expect(pipe.transform('2017-02-21')).toBe('February 21st 2017');
      expect(pipe.transform('2017-02-03')).toBe('February 3rd 2017');
    });

    it('Should handle if the date is not given', () => {
      expect(pipe.transform('')).toBe('');
      expect(pipe.transform()).toBe(undefined);
    });
  });
});

