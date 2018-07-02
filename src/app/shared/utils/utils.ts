import { TitleCasePipe } from '@angular/common';
export class Utils {
  public static convertInTitle(str) {

    if (str) {
      const title: TitleCasePipe = new TitleCasePipe();
      return title.transform(str);
    } else {
      return str;
    }
  }

  public static trim(str: string): string {
    if (str) {
      let s = str;
      s = s.replace(/(^\s*)|(\s*$)/gi, '');
      s = s.replace(/[ ]{2,}/gi, ' ');
      s = s.replace(/\n /, '\n');
      s = s.replace(/ \n/, '\n');
      return s;
    }
    return str;
  }
}
