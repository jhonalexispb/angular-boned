import { Component } from '@angular/core';

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.scss']
})
export class CuotasComponent {
  totalMonto: number = 1000;  // Monto inicial
  cuotas:number  = 0
}
