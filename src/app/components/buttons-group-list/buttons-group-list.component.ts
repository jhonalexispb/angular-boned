import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buttons-group-list',
  templateUrl: './buttons-group-list.component.html',
  styleUrls: ['./buttons-group-list.component.scss']
})
export class ButtonsGroupListComponent {
  showOptions = false; // Determina si los botones de editar y eliminar deben mostrarse

  @Output() editAction = new EventEmitter<void>();
  @Output() deleteAction = new EventEmitter<void>();

  toggleOptions() {
    this.showOptions = !this.showOptions; // Alterna la visibilidad de los botones de acción
  }

  edit() {
    this.editAction.emit(); // Emite el evento para editar
  }

  delete() {
    this.deleteAction.emit(); // Emite el evento para eliminar
  }
}
