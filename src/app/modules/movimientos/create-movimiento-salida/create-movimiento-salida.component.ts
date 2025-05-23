import { Component } from '@angular/core';

@Component({
  selector: 'app-create-movimiento-salida',
  templateUrl: './create-movimiento-salida.component.html',
  styleUrls: ['./create-movimiento-salida.component.scss']
})
export class CreateMovimientoSalidaComponent {
   form = {
    producto: '',
    cantidad: 0,
    motivo: ''
  };

  guardar() {
    console.log('Retiro:', this.form);
    // Aquí puedes emitir a un servicio o guardar en la BD
  }
}
