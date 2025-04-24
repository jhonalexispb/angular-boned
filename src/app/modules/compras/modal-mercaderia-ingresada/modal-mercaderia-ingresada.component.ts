import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-mercaderia-ingresada',
  templateUrl: './modal-mercaderia-ingresada.component.html',
  styleUrls: ['./modal-mercaderia-ingresada.component.scss']
})
export class ModalMercaderiaIngresadaComponent {
  @Input() ORDER_COMPRA:any
  @Input() MERCADERIA:any
  @Input() COMPROBANTE:any = null
  PRODUCTS:any

  subtotal: number = 0;
  impuesto: number = 0;
  total: number = 0;

  constructor(
    public modal: NgbActiveModal,
  ){}

  ngOnInit(){
    this.PRODUCTS = this.MERCADERIA
    this.calcularTotales()
  }

  calcularTotales(): void {
    const total = this.MERCADERIA
      .map((m:any) => parseFloat(m.total))
      .filter((t:number) => !isNaN(t))
      .reduce((sum: number, t: number) => sum + t, 0);
  
    this.total = total;
    this.subtotal = total / 1.18;
    this.impuesto = total - this.subtotal;
  }
}
