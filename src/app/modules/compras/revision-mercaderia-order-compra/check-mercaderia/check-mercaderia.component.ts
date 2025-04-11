import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompraService } from '../../service/compra.service';
import { GestionarMercaderiaCompraComponent } from '../gestionar-mercaderia-compra/gestionar-mercaderia-compra.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { RegistrarComprobanteComponent } from '../registrar-comprobante/registrar-comprobante.component';

@Component({
  selector: 'app-check-mercaderia',
  templateUrl: './check-mercaderia.component.html',
  styleUrls: ['./check-mercaderia.component.scss']
})
export class CheckMercaderiaComponent {
  ID_COMPRA:any
  ORDER:any = []
  ORDER_LIST:any = []
  ORDER_GESTIONADA:any = []
  AFECTACION_IGV:any = []
  loading:boolean = true
  sweet:any = new SweetalertService
  subtotal = 0;
  igv = 0;
  total = 0;
  comprobantes = 0;

  constructor(
      public modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      public compraService: CompraService,
      private route: ActivatedRoute,
    ) {
  }

  ngOnInit(): void {
    const storedCompra = localStorage.getItem('orden_compra_cheking');
    let storedCompraData = storedCompra ? JSON.parse(storedCompra) : null;

    if(storedCompraData){
      this.ID_COMPRA = storedCompraData.id;
    }else{
      this.ID_COMPRA = this.route.snapshot.paramMap.get('id') || '';
    }
    
    this.loading = true
    this.compraService.obtenerProductosOrdenCompra(this.ID_COMPRA, true).subscribe((resp: any) => {
      this.ORDER = resp.order_compra
      this.ORDER_LIST = resp.order_compra_detail
      this.AFECTACION_IGV = resp.afectacion_igv

      localStorage.setItem('orden_compra_cheking', JSON.stringify(this.ORDER));

      const storedComprobante = localStorage.getItem('comprobante_creado_by_orden_compra');
      let storedComprobanteData = storedComprobante ? JSON.parse(storedComprobante) : null;

      if (storedComprobanteData && storedComprobanteData.some((c: any) => c.id_compra == this.ID_COMPRA)) {
        storedComprobanteData.forEach((c: any) => {
          if (c.id_compra == this.ID_COMPRA) {
            c.productos.forEach((prod: any) => {
              const productoId = prod.producto_id;
              const bonificacion = prod.bonificacion;
      
              const productoEnOrden = this.ORDER_LIST.find((p: any) =>
                p.producto_id === productoId && p.bonificacion === bonificacion
              );
      
              if (productoEnOrden) {
                productoEnOrden.gestionado = true;
              }
            });
          }
        });
        this.comprobantes = storedComprobanteData.length
      }
    })
  }
  
  gestionar_producto(producto:any){
    if(producto.gestionado){
      this.sweet.alerta('Atencion','el producto ya fue gestionado')
      return
    }
    const modalRef = this.modalService.open(GestionarMercaderiaCompraComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PRODUCTO = producto
    modalRef.componentInstance.AFECTACION_IGV = this.AFECTACION_IGV
    modalRef.componentInstance.ProductoGestionado.subscribe((p:any) => {
      const productoEncontrado = this.ORDER_LIST.find((item: any) => 
        item.producto_id === producto.producto_id && item.bonificacion === producto.bonificacion
      );

      if (productoEncontrado) {
        productoEncontrado.gestionado = true;
        this.ORDER_LIST = [...this.ORDER_LIST];
        p = { ...p, ...productoEncontrado };
      }
      this.ORDER_GESTIONADA.unshift(p);
      this.calcularTotales()
      this.cdr.detectChanges();
    })
  }

  calcularTotales() {
    let sumaProductos = 0;
    let sumaConIgv = 0;
  
    for (let p of this.ORDER_GESTIONADA) {
      const cantidad = p.detalle.cantidad_exacta ? p.cantidad : p.detalle.cantidad_reemplazo;
      const totalProducto = cantidad * p.pcompra;

      const productoExonerado = this.AFECTACION_IGV.find((a:any) => a.id == p.detalle.afectacion_igv_id && (a.codigo == 20 || a.codigo == 30));
      if (!productoExonerado) {
        sumaConIgv += totalProducto;
      } else {
        sumaProductos += totalProducto;
      }
    }

    this.total = sumaProductos + sumaConIgv;
    this.igv = (sumaConIgv*0.18)/1.18;
    this.subtotal = this.total - this.igv;
  
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
    this.igv = parseFloat(this.igv.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));
  }

  getDescripcionAfectacion(id: any) {
    const item = this.AFECTACION_IGV.find((i:any) => i.id == id);
    return item ? item.descripcion : 'Sin descripción';
  }

  registrar_comprobante(){
    const modalRef = this.modalService.open(RegistrarComprobanteComponent, { centered: true, size: 'md'})
    modalRef.componentInstance.ORDER_GESTIONADA = this.ORDER_GESTIONADA
    modalRef.componentInstance.AFECTACION_IGV = this.AFECTACION_IGV
    modalRef.componentInstance.ID_COMPRA = this.ID_COMPRA
    modalRef.componentInstance.ComprobanteC.subscribe((p:any) => {
      if (p) {
        this.ORDER_GESTIONADA = []
        this.calcularTotales()
        this.comprobantes++
        this.cdr.detectChanges();
      }
    })
  }

  borrar_producto_gestionado(p:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el producto: ${p.nombre} ${p.caracteristicas} de la lista de gestionados?`).then((result:any) => {
      if (result.isConfirmed) {
        this.ORDER_GESTIONADA = this.ORDER_GESTIONADA.filter((item:any) => {
          return !(item.producto_id === p.producto_id && item.bonificacion === p.bonificacion);
        });

        const productoEncontrado = this.ORDER_LIST.find((item: any) => 
          item.producto_id === p.producto_id && item.bonificacion === p.bonificacion
        );
  
        if (productoEncontrado) {
          productoEncontrado.gestionado = false;
          this.ORDER_LIST = [...this.ORDER_LIST];
          p = { ...p, ...productoEncontrado };
        }

        this.calcularTotales()
        this.cdr.detectChanges();
      }
    });
  }
}
