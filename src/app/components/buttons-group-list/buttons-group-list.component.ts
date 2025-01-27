import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-buttons-group-list',
  templateUrl: './buttons-group-list.component.html',
  styleUrls: ['./buttons-group-list.component.scss']
})
export class ButtonsGroupListComponent {
  /* buttonsVisible: boolean = false;  // Control de visibilidad de los botones
  activeDropdownIndex: number | null = null;  // Índice del dropdown activo

  toggleButtonsVisibility() {
    this.buttonsVisible = !this.buttonsVisible
  } */

    @Input() index: number | null = null;  // Índice de la fila para controlar el dropdown
  @Input() activeDropdownIndex: number | null = null;  // Índice del dropdown activo
  @Output() dropdownToggle = new EventEmitter<number>();  // Evento para cambiar el estado

  toggleButtonsVisibility(index: number) {
    // Emitimos el índice del dropdown que se está activando
    this.dropdownToggle.emit(index);
  }
}
