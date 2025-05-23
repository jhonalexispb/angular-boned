import { Component } from '@angular/core';

@Component({
  selector: 'app-list-movimientos',
  templateUrl: './list-movimientos.component.html',
  styleUrls: ['./list-movimientos.component.scss']
})
export class ListMovimientosComponent {
  movimientos = [
    { fecha: new Date(), tipo: 'Ingreso', producto: 'Ibuprofeno', cantidad: 100, motivo: 'Reposición', usuario: 'Admin' },
    { fecha: new Date(), tipo: 'Retiro', producto: 'Paracetamol', cantidad: 30, motivo: 'Daño', usuario: 'Admin' }
  ];
}
