import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompraService } from '../service/compra.service';

@Component({
  selector: 'app-mercaderia-order-compra',
  templateUrl: './mercaderia-order-compra.component.html',
  styleUrls: ['./mercaderia-order-compra.component.scss']
})
export class MercaderiaOrderCompraComponent {

  @Input() ORDER_COMPRA:any
  PRODUCTS:any
  isLoading:boolean = true
  subtotal:any

  constructor(
    public modal: NgbActiveModal,
    public ocService: CompraService
  ){}

  ngOnInit(){
    this.ocService.obtenerProductosOrdenCompraToWatch(this.ORDER_COMPRA.id).subscribe({
      next: (resp: any) => {
        this.isLoading = false
        this.PRODUCTS = resp.order_compra_detail
        this.subtotal = this.ORDER_COMPRA.total - this.ORDER_COMPRA.igv
      },
    })
  }
}
