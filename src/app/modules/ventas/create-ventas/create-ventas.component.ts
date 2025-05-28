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

  irAlPaso2(data: any) {
    this.clienteSeleccionado = data.cliente;
    this.CLIENTES_LIST = data.clientes;
    this.TRANSPORTES_LIST = data.transportes;
    this.pasoActual = 2;
  }

  irAlPaso1() {
    this.pasoActual = 1;
  }

  registrarVentaFinal(data: any) {
    const ventaCompleta = {
      
    };

    // Aquí llamas a tu servicio de registro
    console.log('Venta completa para registrar:', ventaCompleta);
  }
}
