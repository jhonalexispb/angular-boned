import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-seleccionar-comprobante-registrado',
  templateUrl: './seleccionar-comprobante-registrado.component.html',
  styleUrls: ['./seleccionar-comprobante-registrado.component.scss']
})
export class SeleccionarComprobanteRegistradoComponent {
  @Input() ORDER_GESTIONADA:any = []
  @Input() AFECTACION_IGV:any = []
  @Input() COMPROBANTES_LIST:any
  @Input() ID_COMPRA:any
  @Output() ComprobanteC: EventEmitter<any> = new EventEmitter();

  sweet:any = new SweetalertService
  subtotal = 0;
  igv = 0;
  total = 0;

  comprobanteForm: FormGroup;
  constructor(
      private fb: FormBuilder,
      public modal: NgbActiveModal,
  ){
    
  }

  ngOnInit(){
    this.comprobanteForm = this.fb.group({
      igv: [true],
      comprobante_id: ['',[Validators.required]],
      comentario: [''],
    });

    this.calcularTotales()

    this.comprobanteForm.get('igv')?.valueChanges.subscribe((igv) => {
      if (igv) {
        this.igv = 0
      }else{
        this.igv = 0.18
      }
      this.calcularTotales()
    });

    this.comprobanteForm.get('comprobante_id')?.valueChanges.subscribe((igv) => {
      const comp_id = this.COMPROBANTES_LIST.find((p: any) =>
        p.id == igv
      );
      if(comp_id){
        this.comprobanteForm.patchValue({
          igv: comp_id.igv_state,
          comentario: comp_id.comentario
        })

        this.comprobanteForm.get('igv')?.disable();
      }
    });
  }

  onSubmit(){
    if (this.comprobanteForm.valid) {
      const id = this.comprobanteForm.get('comprobante_id')?.value;
      const comp_id = this.COMPROBANTES_LIST.find((p: any) =>
        p.id == id
      );
      
      const formValues = {
        igv:comp_id.igv_state,
        serie:comp_id.serie,
        ncomprobante:comp_id.n_documento,
        comentario:this.comprobanteForm.get('comentario')?.value,
        modo_pago:comp_id.modo_pago,
        fecha_emision:comp_id.fecha_emision,
        fecha_vencimiento:comp_id.fecha_vencimiento,
        monto_real:comp_id.monto_real
      }

      const orden = this.ORDER_GESTIONADA;
      const factura = {
        ...formValues,
        productos: orden,
        id_compra: this.ID_COMPRA,
        total: this.total,
        igv_costo: this.igv,
      };

      const nuevaSerie = formValues.serie;
      const nuevoNumero = formValues.ncomprobante;
      const facturasGuardadas = JSON.parse(localStorage.getItem('comprobante_creado_by_orden_compra') || '[]');
      const yaExiste = facturasGuardadas.some((f: any) => 
        f.serie == nuevaSerie && f.ncomprobante == nuevoNumero
      );
      if (yaExiste) {
        this.sweet.alerta('Atención', 'ya existe un comprobante con esta serie y número');
        return;
      }
      facturasGuardadas.push(factura);
      localStorage.setItem('comprobante_creado_by_orden_compra', JSON.stringify(facturasGuardadas));
      this.ComprobanteC.emit(true);
      this.modal.close();
      this.sweet.success('Bien','el comprobante fue registrado de manera satisfactoria')
    } else {
      this.sweet.formulario_invalido('Ups','Hay errores en tu formulario')
    }
  }

  getDescripcionAfectacion(id: any) {
    const item = this.AFECTACION_IGV.find((i:any) => i.id == id);
    return item ? item.descripcion : 'Sin descripción';
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
  
    if (this.igv > 0) {
      this.subtotal = sumaConIgv + sumaProductos;
      this.igv = sumaConIgv * 0.18;
      this.total = this.subtotal + this.igv;
    } else {
      this.total = sumaProductos + sumaConIgv;
      this.igv = (sumaConIgv*0.18)/1.18;
      this.subtotal = this.total - this.igv;
    }
  
    this.subtotal = parseFloat(this.subtotal.toFixed(2));
    this.igv = parseFloat(this.igv.toFixed(2));
    this.total = parseFloat(this.total.toFixed(2));
  }
}
