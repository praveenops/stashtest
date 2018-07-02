import { DateToTimestampPipe } from '../pipes/date-to-timestamp.pipe';

export class ArrayUtils {
  static dateToTimeStampPipe: DateToTimestampPipe = new DateToTimestampPipe();
  /**
   *
   * @param arr input array
   * @param givenOrder order in which array to be sorted
   * @param {string} If provided, keyToLookFor if input array contains object, mention the key,
   * this key will be compared with given order values
   * @returns {Array}
   */
  static sortArrayWithGivenOrder(arr, givenOrder, keyToLookFor?: string) {
    const result = [];
    givenOrder.forEach((orderItem) => {
      const item = arr.find((arrItem) => {
        return keyToLookFor && (arrItem[keyToLookFor].toString().toLowerCase() === orderItem.toString().toLowerCase())
          || arrItem === orderItem;
      });
      item && result.push({ ...item });
    });
    return result;
  }

  /**
   * Sort an array of objects based on a key and type of field
   * @param array - array of objects
   * @param key - field in the object
   * @param type - type of the key, this method will handle integer(n), string(s) and date(d).
   * @param order - ascending(a) or descending(d) order
   * @returns {any}
   */
  static quicksort(array, key, type, order) {
    if (array.length < 2) {
      return array;
    }

    const pivot = array[0];
    const left = [];
    const right = [];
    let firstObj;
    let secondObj;

    for (let i = 1; i < array.length; i++) {

      // For integer
      if (type === 'number') {
        firstObj = parseInt(array[i][key].replace(/,/gi, ''), 10);
        secondObj = parseInt(pivot[key].replace(/,/gi, ''), 10);
      } else if (type === 'date') { // For date
        firstObj = new Date(this.dateToTimeStampPipe.transform(array[i][key]));
        secondObj = new Date(this.dateToTimeStampPipe.transform(pivot[key]));
      } else { // For string
        firstObj = array[i][key];
        secondObj = pivot[key];
      }

      // Order is 'a' for ascending order otherwise descending
      if (order === 'asc') {
        if (firstObj < secondObj) {
          left.push(array[i]);
        } else {
          right.push(array[i]);
        }
      } else {
        if (firstObj > secondObj) {
          left.push(array[i]);
        } else {
          right.push(array[i]);
        }
      }
    }

    return this.quicksort(left, key, type, order).concat(pivot, this.quicksort(right, key, type, order));
  }

}
