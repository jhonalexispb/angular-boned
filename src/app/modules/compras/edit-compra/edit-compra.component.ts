import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-compra',
  templateUrl: './edit-compra.component.html',
  styleUrls: ['./edit-compra.component.scss']
})
export class EditCompraComponent {
  activeTab: number = 0; // Índice de la pestaña activa, 0 es "Compra" por defecto

  constructor() {}

  // Método para cambiar la pestaña activa
  changeTab(tabIndex: number) {
    this.activeTab = tabIndex; // Cambia la pestaña activa
  }
}
