import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CrearLotesComponent } from '../crear-lotes/crear-lotes.component';

@Component({
  selector: 'app-gestionar-mercaderia-compra',
  templateUrl: './gestionar-mercaderia-compra.component.html',
  styleUrls: ['./gestionar-mercaderia-compra.component.scss']
})
export class GestionarMercaderiaCompraComponent {
  @Input() PRODUCTO:any = []
  @Output() ProductoGestionado: EventEmitter<any> = new EventEmitter();
  @Input() AFECTACION_IGV:any[] = []
  LOTES_LIST:any = []
  REGISTROS_SANITARIOS_LIST:any = []
  cantidad_esperada:number
  cantidad_pendiente_lote:number
  detalleForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    public modalService: NgbModal,
    public modal: NgbActiveModal,
    private fb: FormBuilder,
  ){
  }
  
  ngOnInit(){
    this.cantidad_esperada = this.PRODUCTO.cantidad
    this.detalleForm = this.fb.group({
      cantidad_exacta: [true],
      cantidad_reemplazo: [''],
      mantener_cantidad: [false],
      cantidad_mantener: [''],
      cantidad: [null, [Validators.required]],
      cantidad_pendiente: [{ value: '', disabled: true }],
      /* guia_devolucion:[false], */
      comentario:[''],
      afectacion_igv_id:[this.PRODUCTO.afectacion_producto_id || '']
    });

    this.detalleForm.get('cantidad')?.valueChanges.subscribe((cantidad) => {
      const cantidadNumerica = Number(cantidad);
      if (cantidad === null || cantidad === undefined || cantidad === '') {
        this.detalleForm.patchValue({ cantidad: 0 });
        return;
      }
      this.detalleForm.patchValue({ cantidad: cantidadNumerica },{ emitEvent: false });
      if (cantidad != null) {
        const cantidad_pendiente = this.cantidad_esperada - cantidadNumerica;
        this.detalleForm.patchValue({ cantidad_pendiente: cantidad_pendiente });
      }
      if(cantidadNumerica > this.cantidad_esperada){
        this.detalleForm.patchValue({ cantidad: 0 })
        this.sweet.alerta('Ups',`La cantidad no puede ser mayor a la cantidad esperada (${this.cantidad_esperada})`)
      }
    });

    this.detalleForm.get('cantidad_reemplazo')?.valueChanges.subscribe((cantidad_reemplazo) => {
      const cantidadNumerica = Number(cantidad_reemplazo);
      this.detalleForm.patchValue({ cantidad_reemplazo: cantidadNumerica },{ emitEvent: false });
    });

    this.detalleForm.get('cantidad_exacta')?.valueChanges.subscribe((cantidad_exacta) => {
      if(cantidad_exacta){
        this.cantidad_esperada = this.PRODUCTO.cantidad
        this.detalleForm.get('cantidad_reemplazo')?.clearValidators();
      } else {
        this.cantidad_esperada = 0
        this.detalleForm.get('cantidad_reemplazo')?.setValidators([Validators.required]);
      }

      this.detalleForm.patchValue({
        cantidad: null,
        cantidad_pendiente: null,
        cantidad_reemplazo: '',
        /* guia_devolucion: false */
      });
    });

    this.detalleForm.get('mantener_cantidad')?.valueChanges.subscribe((mantener) => {
      if(mantener){
        this.detalleForm.get('cantidad_mantener')?.patchValue(this.PRODUCTO.cantidad - this.detalleForm.get('cantidad_reemplazo')?.value);
      }
    });
  }

  get mostrarCantidadPendiente(): boolean {
    const cantidad = this.detalleForm.get('cantidad')?.value;
    return cantidad != null && (this.cantidad_esperada - cantidad) > 0 && this.cantidad_esperada > 0 && this.detalleForm.get('cantidad_pendiente')?.value != null;
  }

  cambiar_cantidad_pendiente(){
    this.cantidad_esperada = this.detalleForm.get('cantidad_reemplazo')?.value
    const cantidad = this.detalleForm.get('cantidad')?.value
    if (this.cantidad_esperada != null) {
      const cantidad_pendiente = this.cantidad_esperada - cantidad;
      this.detalleForm.patchValue({ cantidad_pendiente: cantidad_pendiente });
    }
  }

  createLote(PROD:any){
    if(!this.detalleForm.get('cantidad')?.value || this.detalleForm.get('cantidad')?.value <= 0){
      this.sweet.alerta('Error', 'para crear un lote necesitas definir una cantidad')
      return
    }
    const cantidadGestionada = this.LOTES_LIST.reduce((total:any, lote:any) => total + (lote.cantidad || 0), 0);
    this.cantidad_pendiente_lote = (this.detalleForm.get('cantidad')?.value || 0) - cantidadGestionada; 
    if(this.cantidad_pendiente_lote <= 0){
      this.sweet.alerta('Ups',`ya gestionaste la cantidad (${this.detalleForm.get('cantidad')?.value}) de este producto`)
      return
    }
    const modalRef = this.modalService.open(CrearLotesComponent,{centered:true, size: 'md'})
    const productoConNombreCompleto = {
        ...PROD,
        nombre_completo: `${PROD.nombre} ${PROD.caracteristicas}`
    };
    modalRef.componentInstance.PRODUCT_ID = productoConNombreCompleto
    modalRef.componentInstance.CANTIDAD_PENDIENTE_LOTE = this.cantidad_pendiente_lote
    modalRef.componentInstance.LoteC.subscribe((r:any)=>{
      const yaExiste = this.LOTES_LIST.some((item: { lote: string, fecha_vencimiento: string }) =>
        item.lote === r.lote && item.fecha_vencimiento === r.fecha_vencimiento
      );

      if (!yaExiste) {
        this.LOTES_LIST.unshift(r);
        this.sweet.success(
          '¡Éxito!',
          'el lote se registró correctamente'
        );
      } else {
        this.sweet.alerta('Ups','el lote y fecha de vencimiento ya estan siendo usados')
      }
    })
  }

  deleteLote(LOTE:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el lote: ${LOTE.lote || 'Sin lote'} con fecha de vencimiento ${LOTE.fecha_vencimiento || 'Sin fecha de vencimiento'}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.LOTES_LIST = this.LOTES_LIST.filter((item:any) => {
          return !(item.lote === LOTE.lote && item.fecha_vencimiento === LOTE.fecha_vencimiento);
        });
      }
    });
  }

  onSubmit(){
    const cantidadGestionada = this.LOTES_LIST.reduce((total:any, lote:any) => total + (lote.cantidad || 0), 0);
    this.cantidad_pendiente_lote = (this.detalleForm.get('cantidad')?.value || 0) - cantidadGestionada; 
    if(this.cantidad_pendiente_lote > 0){
      this.sweet.alerta('Atencion', `hay ${this.cantidad_pendiente_lote} cantidades pendientes por gestionar`)
      return
    }

    const cantidad = this.detalleForm.get('cantidad')?.value || 0;

    if(cantidadGestionada != cantidad){
      this.sweet.alerta('Atencion', `la cantidad (${cantidad}) no coincide con la sumatoria de lotes (${cantidadGestionada})`)
      return
    }

    if (this.detalleForm.valid) {
      const datosAEmitir = {
        detalle: this.detalleForm.getRawValue(),
        lotes: this.LOTES_LIST       
      };
      this.ProductoGestionado.emit(datosAEmitir);
      this.modal.close();
      this.sweet.success('Bien','el producto fue gestionado de manera satisfactoria')
    }else{
      this.sweet.formulario_invalido('Atencion', 'formulario invalido')
    }
  }

  /* createRegistroSanitario(PROD:any){
    if(!this.detalleForm.get('cantidad')?.value || this.detalleForm.get('cantidad')?.value <= 0){
      this.sweet.alerta('Error', 'Para crear un registro sanitario necesitas definir una cantidad')
      return
    }
    const modalRef = this.modalService.open(CrearRegistroSanitarioComponent,{centered:true, size: 'md'})
    const productoConNombreCompleto = {
        ...PROD,
        nombre_completo: `${PROD.nombre} ${PROD.caracteristicas}`
    };
 
    modalRef.componentInstance.PRODUCT_ID = productoConNombreCompleto
    modalRef.componentInstance.RegistroSanitarioC.subscribe((r:any)=>{
      this.REGISTROS_SANITARIOS_LIST.unshift(r);
    })
  } */
}

