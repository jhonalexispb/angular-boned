import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CompraService } from '../../service/compra.service';
import { VerProductoComprobanteComponent } from '../ver-producto-comprobante/ver-producto-comprobante.component';
import { Router } from '@angular/router';

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
      private cdr: ChangeDetectorRef,
      private router: Router
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

  borrar_comprobante(p:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el comprobante: ${p.serie}-${p.ncomprobante}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.COMPROBANTES_LIST = this.COMPROBANTES_LIST.filter((comp: any) =>
          !(comp.serie === p.serie && comp.ncomprobante === p.ncomprobante)
        );
        const comprobantesLS = JSON.parse(localStorage.getItem('comprobante_creado_by_orden_compra') || '[]');
        const nuevosComprobantes = comprobantesLS.filter((comp: any) =>
          !(comp.serie === p.serie && comp.ncomprobante === p.ncomprobante)
        );
        localStorage.setItem('comprobante_creado_by_orden_compra', JSON.stringify(nuevosComprobantes));
        this.cdr.detectChanges();
      }
    });
  }

  ver_productos(p:any){
    const afectacion_igv_data = localStorage.getItem('afectacion_igv')
    let afectacion_igv = afectacion_igv_data ? JSON.parse(afectacion_igv_data) : null;

    const modalRef = this.modalService.open(VerProductoComprobanteComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.ORDER_GESTIONADA_PRODUCTS = p.productos
    modalRef.componentInstance.AFECTACION_IGV = afectacion_igv
  }

  registrar_compra(){
    if(this.COMPROBANTES_LIST.length <= 0){
      this.sweet.alerta('Ups','la lista de comprobantes esta vacia, gestiona la mercaderia por favor')
      return
    }
    this.sweet.confirmar('¿Estas seguro?',`¿Desea registrar la compra?`,'/assets/animations/general/ojitos.json','Si, hagamoslo','Cancelar').then((result:any) => {
      if (result.isConfirmed) {
        const comprobantes = JSON.parse(localStorage.getItem("comprobante_creado_by_orden_compra") || "[]");
        const data = comprobantes.map((compraForm: any) => {
          return {
            orden_compra_id: this.ORDER.id, // reemplaza esto por el ID real
            type_comprobante_compra_id: this.ORDER.comprobante_id,
            serie: compraForm.serie,
            n_documento: compraForm.ncomprobante,
            igv_state: compraForm.igv,
            importe: (compraForm.total - compraForm.igv_costo).toFixed(2),
            igv: compraForm.igv_costo,
            modo_pago: compraForm.modo_pago,
            total: compraForm.total,
            monto_real: compraForm.monto_real,
            fecha_emision: compraForm.fecha_emision,
            fecha_vencimiento: compraForm.fecha_vencimiento,
            comentario: compraForm.comentario,
            productos: compraForm.productos.map((item: any) => ({
              afectacion_id: item.detalle.afectacion_igv_id,
              producto_id: item.producto_id,
              cantidad: item.detalle.cantidad_exacta
                ? item.detalle.cantidad
                : item.detalle.cantidad_reemplazo,
              total: (Number(
                item.detalle.cantidad_exacta
                  ? item.detalle.cantidad
                  : item.detalle.cantidad_reemplazo
              ) * Number(item.pcompra)).toFixed(2),
              bonificacion: item.bonificacion,
              comentario: item.detalle.comentario,
              pcompra: item.pcompra,
              pventa: item.pventa,
              /* guia_devolucion: item.detalle.guia_devolucion, */
              cantidad_pendiente: item.detalle.cantidad_pendiente || 0,
              cantidad_reemplazo: item.detalle.cantidad_reemplazo || 0,
              lotes: item.lotes.map((lote: any) => ({
                cantidad: lote.cantidad,
                fecha_vencimiento: lote.fecha_vencimiento,
                lote: lote.lote,
                producto_id: item.producto_id,
              }))
            }))
          };
        });

        this.compraService.registrarComprobantesOrdenCompra(data,this.ORDER.id).subscribe({
          next: (resp: any) => {
            this.compraService.actualizarCarritoCompra();
            setTimeout(() => {
              this.router.navigate(['/compras/list']);
              this.sweet.success(
                '¡Éxito!',
                'Los productos fueron ingresados correctamente'
              );
            }, 100);
          },
        });
      }
    })
  }
}
