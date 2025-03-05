import { Component } from '@angular/core';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.scss']
})
export class OrdenCompraComponent {
  activeTab: number = 0; // Índice de la pestaña activa, 0 es "Compra" por defecto

  constructor() {}

  // Método para cambiar la pestaña activa
  changeTab(tabIndex: number) {
    this.activeTab = tabIndex; // Cambia la pestaña activa
  }
}
