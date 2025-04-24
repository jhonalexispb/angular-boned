import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMercaderiaIngresadaComponent } from '../modal-mercaderia-ingresada/modal-mercaderia-ingresada.component';

@Component({
  selector: 'app-modal-comprobantes',
  templateUrl: './modal-comprobantes.component.html',
  styleUrls: ['./modal-comprobantes.component.scss']
})
export class ModalComprobantesComponent {
  @Input() ORDER_COMPRA:any
  COMPROBANTES:any
  GUIAS_DEVOLUCION:any

  constructor(
    public modalService: NgbModal,
    public modal: NgbActiveModal,
  ){}

  ngOnInit(){
    this.COMPROBANTES = this.ORDER_COMPRA.comprobantes
    this.GUIAS_DEVOLUCION = this.ORDER_COMPRA.guias_devolucion
  }
  verMercaderia(R: any) {
    const agrupado = this.consolidarIngresos(R.mercaderia);
    console.log(R.mercaderia)
    const modalRef = this.modalService.open(ModalMercaderiaIngresadaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.ORDER_COMPRA = this.ORDER_COMPRA;
    modalRef.componentInstance.MERCADERIA = agrupado;
    modalRef.componentInstance.COMPROBANTE = `${R.serie}-${R.n_documento}`
  }

  consolidarIngresos(ingresos: any[]) {
    const consolidados: { [clave: string]: any } = {};
  
    ingresos.forEach(item => {
      const clave = `${item.sku}||${item.bonificacion}||${item.lote ?? 'null'}||${item.fecha_vencimiento ?? 'null'}`;
  
      if (!consolidados[clave]) {
        consolidados[clave] = {
          sku: item.sku,
          nombre: item.nombre,
          imagen: item.imagen,
          caracteristicas: item.caracteristicas,
          bonificacion: item.bonificacion,
          lote: item.lote,
          fecha_vencimiento: item.fecha_vencimiento,
          cantidad: 0,
          total: 0,
          pcompra: item.pcompra
        };
      }
  
      consolidados[clave].cantidad += item.cantidad;
      consolidados[clave].total += parseFloat(item.total);
    });
  
    return Object.values(consolidados);
  }
}
