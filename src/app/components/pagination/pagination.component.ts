import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() collectionSize: number = 0;  // Número total de elementos
  @Input() pageSize: number = 25;  // Tamaño de la página
  @Input() currentPage: number = 1;  // Página actual

  @Output() pageChange = new EventEmitter<number>();  // Evento para el cambio de página

  // Método para manejar el cambio de página
  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  // Para formatear el valor del input del número de página
  
}
