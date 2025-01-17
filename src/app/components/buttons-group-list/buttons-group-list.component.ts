import { Component } from '@angular/core';

@Component({
  selector: 'app-buttons-group-list',
  templateUrl: './buttons-group-list.component.html',
  styleUrls: ['./buttons-group-list.component.scss']
})
export class ButtonsGroupListComponent {
  buttonsVisible: boolean = false;  // Control de visibilidad de los botones

  // Función para alternar la visibilidad de los botones
  toggleButtonsVisibility() {
    this.buttonsVisible = !this.buttonsVisible;
  }
}
