
export class DateUtils {
  static months: { [Num: string]: string; } = {
    ['01']: 'Jan',
    ['02']: 'Feb',
    ['03']: 'Mar',
    ['04']: 'Apr',
    ['05']: 'May',
    ['06']: 'Jun',
    ['07']: 'Jul',
    ['08']: 'Aug',
    ['09']: 'Sep',
    ['10']: 'Oct',
    ['11']: 'Nov',
    ['12']: 'Dec'
  };

  static formatYYYYMMDDDate(date) {
    // Input YYYY-MM-DD
    const splitdate = date.split('-', 3);
    // console.log(splitdate[2] + ' ' + this.months[splitdate[1]] + ' ' + splitdate[0]);
    const formattedDate = splitdate[2] + ' ' + DateUtils.months[splitdate[1]] + ' ' + splitdate[0];
    // Output DD MMM YYYY
    return formattedDate;
  }

  static formatMMDDYYYYDate(date) {
    // Input MM/DD/YYYY
    const splitdate = date.split('/', 3);
    // console.log(splitdate[1] + ' ' + this.months[splitdate[0]] + ' ' + splitdate[2]);
    const formattedDate = splitdate[1] + ' ' + DateUtils.months[splitdate[0]] + ' ' + splitdate[2];
    // Output DD MMM YYYY
    return formattedDate;
  }
}
