import { Component } from '@angular/core';

@Component({
  selector: 'app-create-ventas',
  templateUrl: './create-ventas.component.html',
  styleUrls: ['./create-ventas.component.scss']
})
export class CreateVentasComponent {
  pasoActual = 1;
  clienteSeleccionado: any = null;
  CLIENTES_LIST: any[] = [];
  TRANSPORTES_LIST: any[] = [];
  order_venta_data: any[] = [];

  irAlPaso2(data: any) {
    this.clienteSeleccionado = data.cliente;
    this.CLIENTES_LIST = data.clientes;
    this.TRANSPORTES_LIST = data.transportes;
    this.order_venta_data = data.order_venta_data;
    this.pasoActual = 2;
  }

  irAlPaso1() {
    this.pasoActual = 1;
  }
}
