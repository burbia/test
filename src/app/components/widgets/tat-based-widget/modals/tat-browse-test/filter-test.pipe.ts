import { Pipe, PipeTransform } from '@angular/core';
import { Test } from 'src/app/models/test.model';
@Pipe({name: 'filterTest'})
export class FilterTestPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) { return []; }
        if (!searchText) { return items; }
        searchText = searchText.toLowerCase();
        return items.filter((it: Test) => {
            return it.name.toLowerCase().includes(searchText);
        });
    }
}

@Pipe({
    name: 'sortTest',
    pure: false
  })
  export class ArrayTestSortPipe  implements PipeTransform {
    transform(array: any): any[] {
      if (!Array.isArray(array)) {
        return;
      }
      array.sort((a: Test, b: Test) => {
        const textA = a.name.toLowerCase();
        const textB = b.name.toLowerCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      return array;
    }
  }
