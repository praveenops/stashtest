import {ArrayUtils} from './array-utils';

describe('ArrayUtils', () => {
  it('Should sort the array of object with given order', () => {
    const arr = [{id: 10}, {id: 4}, {id: 8}, {id: 3}];
    const order = [8, 4, 3];
    const result = ArrayUtils.sortArrayWithGivenOrder(arr, order, 'id');
    expect(result[0].id).toBe(8);
    expect(result[1].id).toBe(4);
    expect(result[2].id).toBe(3);
    expect(result.length).toBe(3);
  });

  xit('Should sort the array with the given order', () => {
    const arr = [10, 4, 8, 3];
    const order = [8, 4, 3];
    const result = ArrayUtils.sortArrayWithGivenOrder(arr, order);
    expect(result[0]).toBe(8);
    expect(result[1]).toBe(4);
    expect(result[2]).toBe(3);
    expect(result.length).toBe(3);
  });
});
