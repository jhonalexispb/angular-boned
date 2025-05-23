import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-paso2',
  templateUrl: './paso2.component.html',
  styleUrls: ['./paso2.component.scss']
})
export class Paso2Component implements OnInit {
  @Input() cliente: any;
  @Input() clientes: any[] = [];
  @Output() onVentaCompleta = new EventEmitter<any>();

  clienteSeleccionado: any = null;
  comprobanteSeleccionado: string | null = null;
  formaPago: string = '1'; // 1: contado, 2: adelantado, 3: contraentrega
  destino: string = 'local';
  transporte: string = '';
  direccionEntrega: string = '';
  coordenadas: { lat: number, lng: number } | null = null;

  ngOnInit(): void {
    if (this.cliente) {
      this.setCliente(this.cliente);
    }
  }

  setCliente(clienteId: number) {
    this.clienteSeleccionado = this.clientes.find(c => c.id === +clienteId);
    if (this.clienteSeleccionado) {
      this.formaPago = this.clienteSeleccionado.forma_pago || '1';
      this.comprobanteSeleccionado = null;
    }
  }

  registrarVenta() {
    if (!this.clienteSeleccionado || !this.comprobanteSeleccionado || !this.transporte || !this.direccionEntrega) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const ventaData = {
      cliente_id: this.clienteSeleccionado.id,
      comprobante: this.comprobanteSeleccionado,
      forma_pago: this.formaPago,
      destino: this.destino,
      transporte: this.transporte,
      direccion_entrega: this.direccionEntrega,
      coordenadas: this.coordenadas
    };

    this.onVentaCompleta.emit(ventaData);
  }

  obtenerCoordenadas() {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        this.coordenadas = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
      },
      err => {
        alert('No se pudieron obtener las coordenadas');
      }
    );
  }
}

