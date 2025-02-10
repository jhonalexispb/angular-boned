import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-buttons-group-list',
  templateUrl: './buttons-group-list.component.html',
  styleUrls: ['./buttons-group-list.component.scss']
})
export class ButtonsGroupListComponent {
  @Input() index: number | null = null;  // Índice de la fila para controlar el dropdown
  @Input() activeDropdownIndex: number | null = null;  // Índice del dropdown activo
  @Output() dropdownToggle = new EventEmitter<number>();  // Evento para cambiar el estado

  toggleButtonsVisibility(index: number) {
    this.dropdownToggle.emit(index);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.dropdown');
    if (!clickedInside) {
      this.activeDropdownIndex = null; 
    }
  }
}
