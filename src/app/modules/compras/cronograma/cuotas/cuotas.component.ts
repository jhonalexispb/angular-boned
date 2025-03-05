import { Component } from '@angular/core';

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.scss']
})
export class CuotasComponent {
  totalMonto: number = 1000;  // Monto inicial
  cuotas: { fecha: string, monto: number, observacion: string }[] = [];

  constructor() {}

  addCuota() {
    const cuotaCount = this.cuotas.length + 1;
    const cuotaMonto = this.totalMonto / cuotaCount;

    // Determinar fecha lógica (simplemente le añadimos un día a la fecha de la última cuota)
    const lastCuotaDate = this.cuotas.length > 0 ? new Date(this.cuotas[this.cuotas.length - 1].fecha) : new Date();
    const newDate = new Date(lastCuotaDate.setDate(lastCuotaDate.getDate() + 1));  // Agregar un día de diferencia

    this.cuotas.push({
      fecha: newDate.toISOString().split('T')[0],  // Formato YYYY-MM-DD
      monto: cuotaMonto,
      observacion: ''
    });
    this.updateMontos();
  }

  updateMontos() {
    const cuotaCount = this.cuotas.length;
    const cuotaMonto = this.totalMonto / cuotaCount;

    // Actualizamos el monto de cada cuota
    this.cuotas.forEach(cuota => {
      cuota.monto = cuotaMonto;
    });
  }
}
