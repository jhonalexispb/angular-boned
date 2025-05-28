import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VentaProcesoService {
  ventaTemporal: any = null;

  setVentaParcial(venta: any) {
    this.ventaTemporal = venta;
  }

  getVentaParcial(): any {
    return this.ventaTemporal;
  }

  clearVentaParcial() {
    this.ventaTemporal = null;
  }
}