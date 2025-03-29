import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { CompraService } from '../../service/compra.service';
import { GestionarMercaderiaCompraComponent } from '../gestionar-mercaderia-compra/gestionar-mercaderia-compra.component';

@Component({
  selector: 'app-check-mercaderia',
  templateUrl: './check-mercaderia.component.html',
  styleUrls: ['./check-mercaderia.component.scss']
})
export class CheckMercaderiaComponent {
  ID_COMPRA:any
  ORDER:any = []
  ORDER_LIST:any = []
  loading:boolean = true

  constructor(
      private fb: FormBuilder,
      public modalService: NgbModal,
      private cdr: ChangeDetectorRef,
      //llamamos al servicio
      public compraService: CompraService,
      private router: Router,
      private route: ActivatedRoute,
    ) {
  }

  ngOnInit(): void {
      this.ID_COMPRA = this.route.snapshot.paramMap.get('id') || '';
      this.loading = true
      this.compraService.obtenerProductosOrdenCompra(this.ID_COMPRA, true).subscribe((resp: any) => {
        this.ORDER = resp.order_compra
        this.ORDER_LIST = resp.order_compra_detail
      })
  
      /* this.compraForm = this.fb.group({
        compra_id: [this.ID_COMPRA, [Validators.required]],
        laboratorio_id: [[], [Validators.required]],
        proveedor_id: [null, [Validators.required]],
        proveedor_name: ['', [Validators.required]],
        product_id: [null, [Validators.required]],
        product_id_bonificacion: [null],
        forma_pago_id: [null, [Validators.required]],
        type_comprobante_compra_id: [null, [Validators.required]],
        igv: [0, [Validators.required]],
        total: [0, [Validators.required]],
        impuesto: [0, [Validators.required]],
        sub_total: [0, [Validators.required]],
        user: [this.user.getUser()],
        notificacion: [false, [Validators.required]],
        mensaje_notificacion: ['', [Validators.required]],
        fecha_ingreso: ['', [Validators.required]],
        descripcion: [''],
      }); */
    
      // Ejecutar las dos peticiones en paralelo
      /* forkJoin({
        recursos: this.compraService.obtenerRecursosParaEditar(),
        orden: this.compraService.obtenerOrdenParaEditar(this.ID_COMPRA)
      }).subscribe({
        next: ({ recursos, orden }: any) => {
          this.PROVEEDORES_LIST = recursos.proveedores;
          this.FORMA_PAGO_LIST = recursos.forma_pago;
          this.TIPO_COMPROBANTE_LIST = recursos.tipo_comprobante;
    
          this.codigo = orden.order_compra.codigo;
    
          // Usar `patchValue` en lugar de redefinir el FormGroup
          this.compraForm.patchValue({
            laboratorio_id: [],
            proveedor_id: orden.order_compra.proveedor,
            proveedor_name: orden.order_compra.proveedor_name,
            product_id: null,
            forma_pago_id: orden.order_compra.forma_pago_id,
            type_comprobante_compra_id: orden.order_compra.type_comprobante_compra_id,
            igv: orden.order_compra.igv,
            total: orden.order_compra.total,
            impuesto: orden.order_compra.impuesto,
            sub_total: orden.order_compra.sub_total,
            user: this.user.getUser(),
            notificacion: orden.order_compra.notificacion,
            mensaje_notificacion: orden.order_compra.mensaje_notificacion,
            fecha_ingreso: orden.order_compra.fecha_ingreso,
            descripcion: orden.order_compra.descripcion
          });
  
          this.subtotal = orden.order_compra.sub_total
          this.impuesto = orden.order_compra.impuesto
          this.totalCarrito = orden.order_compra.total
          this.COMPRA_DETAILS = orden.order_compra_detail
  
          this.onProveedorChange(orden.order_compra.proveedor)
          this.loading = false;
  
  
          const storedCompra = localStorage.getItem('compra_edit_selected');
          let storedCompraData = storedCompra ? JSON.parse(storedCompra) : null;
  
          if (!storedCompraData || storedCompraData.compra_id !== this.ID_COMPRA) {
            localStorage.setItem('compra_edit_selected', JSON.stringify([]));
            localStorage.setItem('compra_edit_detail_selected', JSON.stringify([]));
          }else{
            const compraStoredDetail = localStorage.getItem('compra_edit_detail_selected');
            let storedCompraDetail = compraStoredDetail ? JSON.parse(compraStoredDetail) : null;
  
            this.COMPRA_DETAILS = storedCompraDetail
          }
  
          this.setearIgv()
        }
      }); */
    }
  
  gestionar_producto(producto:any){
    const modalRef = this.modalService.open(GestionarMercaderiaCompraComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PRODUCTO = producto
  }
}
