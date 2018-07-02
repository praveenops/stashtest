import { DateToTimestampPipe } from './date-to-timestamp.pipe';

describe('DateToTimestampPipe', () => {
  it('create an instance', () => {
    const pipe = new DateToTimestampPipe();
    expect(pipe).toBeTruthy();
  });

  it(`should convert date with milli-seconds into timestamp`, () => {
    const pipe = new DateToTimestampPipe();
    expect(pipe.transform('2017-01-29 05:00:00.000')).toBe('2017-01-29T05:00:00.000Z');
  });

  it(`should not convert date into timestamp when it's not in expected format`, () => {
    const pipe = new DateToTimestampPipe();
    expect(pipe.transform('2017-01-29 05:00:00.00')).toBe('2017-01-29 05:00:00.00');
  });

});
