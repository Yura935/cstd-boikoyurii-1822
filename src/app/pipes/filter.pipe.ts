import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Array<any>, field: string): Array<any> {
    if (!value) {
      return value;
    }
    if (!field) {
      return [];
    }
    if (field && value) {
      return value.filter(item => item.userName.toLowerCase().includes(field.toLowerCase()));
    }
    return value;
  }

}
