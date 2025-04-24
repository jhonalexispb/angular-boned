import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByNombre'
})
export class FilterByNombrePipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();
    return items.filter(item =>
      item.nombre.toLowerCase().includes(searchText)
    );
  }
}