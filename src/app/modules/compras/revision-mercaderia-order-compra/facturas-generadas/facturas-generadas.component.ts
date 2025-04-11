import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CompraService } from '../../service/compra.service';

@Component({
  selector: 'app-facturas-generadas',
  templateUrl: './facturas-generadas.component.html',
  styleUrls: ['./facturas-generadas.component.scss']
})
export class FacturasGeneradasComponent {
  ORDER:any = []
  COMPROBANTES_LIST:any = []
  sweet:any = new SweetalertService
  comprobantes = 0;

  constructor(
      public modalService: NgbModal,
      public compraService: CompraService,
    ) {
  }

  ngOnInit(): void {
    const storedOrderCheking = localStorage.getItem('orden_compra_cheking');
    let storedOrderChekingData = storedOrderCheking ? JSON.parse(storedOrderCheking) : null;

    if(storedOrderChekingData){
      this.ORDER = storedOrderChekingData
      const storedComprobante = localStorage.getItem('comprobante_creado_by_orden_compra');
      let storedComprobanteData = storedComprobante ? JSON.parse(storedComprobante) : null;

      if(storedComprobanteData){
        this.COMPROBANTES_LIST = storedComprobanteData
        this.comprobantes = storedComprobanteData.length
      }
    }
  }
}
