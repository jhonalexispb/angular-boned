import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CompraService } from '../service/compra.service';
import { ModalEscalasComponent } from '../../products/modal-escalas/modal-escalas.component';
import { ModalLotesComponent } from '../../products/modal-lotes/modal-lotes.component';

@Component({
  selector: 'app-producto-seleccionado',
  templateUrl: './producto-seleccionado.component.html',
  styleUrls: ['./producto-seleccionado.component.scss']
})
export class ProductoSeleccionadoComponent {
  @Output() ProductoComprado: EventEmitter<any> = new EventEmitter();
  @Input() PRODUCTO_ID:any
  @Input() PRODUCT_SELECTED:any
  @Input() LABORATORIO_ID:any
  DATA_PRODUCT_SELECTED:any = {
    'stock' : 0,
    'pventa' : 0.0,
    'pcompra' : 0.0,
    'lotes' : [],
    'escalas' :[]
  }

  isLoading:boolean = true

  tipoSeleccionado:any = 'menorIgual';
  precioMinimo: number;
  productoInsertForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    public compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.compraService.obtenerDetalleProducto(this.PRODUCTO_ID).subscribe((resp: any) => {
      this.DATA_PRODUCT_SELECTED = resp
      this.isLoading = false
    });
    this.productoInsertForm = this.fb.group({
      cantidad: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)] // Solo números enteros positivos (>0)
      ],      
      pcompra: [
        '',
        [Validators.required, Validators.min(0.01)]
      ],      
      pventa: [
        { value: '', disabled: true },
        [Validators.required, Validators.min(0.01),this.validarPrecioMinimo.bind(this)]
      ],      
      fecha_vencimiento: [{ value: '', disabled: true }, Validators.required], 
      meses: [{ value: '', disabled: false }],
      margen_minimo: [this.LABORATORIO_ID.margen_minimo,[Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d+)?$/)]] 
    });

    this.productoInsertForm.get('pcompra')?.valueChanges.subscribe((valor) => {
      this.calcularPrecioVenta(valor);
    });
  }

  calcularPrecioVenta(pcompra: any) {
    // Verificar si pcompra es un número válido
    if (!pcompra || isNaN(Number(pcompra))) {
      this.productoInsertForm.patchValue({pventa: null})
      this.productoInsertForm.get('pventa')?.disable();
      return;
    }

    this.productoInsertForm.get('pventa')?.enable();
    const margen = this.productoInsertForm.get('margen_minimo')?.value || 0; // Asegurar que haya un margen válido
    this.precioMinimo = Number(pcompra) + (Number(pcompra) * margen / 100); // Convertir pcompra a número
  
    this.productoInsertForm.patchValue({ pventa: this.precioMinimo.toFixed(2) });
  }

  validarPrecioMinimo(control: any) {
    if (!this.productoInsertForm) return null; // Evitar errores en la inicialización
    if (!control.value) return null;
  
    const pcompra = Number(this.productoInsertForm.get('pcompra')?.value);
    const margen = this.LABORATORIO_ID?.margen_minimo || 0;
    const precioMinimo = pcompra + (pcompra * margen / 100);
  
    return control.value < precioMinimo ? { precioInvalido: true } : null;
  }

  onSubmit(): void {
    if (this.productoInsertForm.valid) {
      this.ProductoComprado.emit(this.productoInsertForm.getRawValue());
      this.modal.close();
      this.sweet.success(
        '¡Éxito!',
        'producto agregado'
      );
    } else {
      console.log("Errores en el formulario:", this.obtenerErrores());
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  obtenerErrores(): any {
    const errores: any = {};
    Object.keys(this.productoInsertForm.controls).forEach((campo) => {
      const control = this.productoInsertForm.get(campo);
      if (control?.invalid) {
        errores[campo] = control.errors;
      }
    });
    return errores;
  }

  seleccionarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.productoInsertForm.patchValue({fecha_vencimiento: null})
  
    if (tipo === 'menorIgual') {
      this.productoInsertForm.get('fecha_vencimiento')?.disable();
      this.productoInsertForm.get('meses')?.enable();
    } else {
      this.productoInsertForm.get('fecha_vencimiento')?.enable();
      this.productoInsertForm.get('meses')?.disable();
    }
  }

  calcularFecha() {
    const meses = this.productoInsertForm.get('meses')?.value;
    if (!meses || meses < 1) {
      this.productoInsertForm.patchValue({ fecha_vencimiento: null });
      return;
    }
    let fechaActual = new Date();
    let mesDestino = fechaActual.getMonth() + meses;
    let añoDestino = fechaActual.getFullYear();
    if (mesDestino > 11) {
      añoDestino += Math.floor(mesDestino / 12);
      mesDestino = mesDestino % 12;
    }
    let fechaVencimiento = new Date(añoDestino, mesDestino + 1, 0);
    const año = fechaVencimiento.getFullYear();
    const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaVencimiento.getDate()).padStart(2, '0')
    const fechaFormateada = `${año}-${mes}-${dia}`;
    this.productoInsertForm.patchValue({ fecha_vencimiento: fechaFormateada });
  }

  validarNumero(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(key)) {
      event.preventDefault();
    }
  }

  validarPrecio(event: any, input:any) {
    let valor = event.target.value;
  
    // Reemplazar caracteres no numéricos excepto puntos
    valor = valor.replace(/[^0-9.]/g, '');
  
    // Evitar más de un punto decimal
    let partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }
  
    // Evitar que empiece con un punto
    if (valor.startsWith('.')) {
      valor = '0' + valor;
    }
  
    // Limitar a dos decimales
    if (partes.length === 2) {
      partes[1] = partes[1].substring(0, 2); // Solo 2 decimales
      valor = partes.join('.');
    }
  
    // Actualizar el valor en el input
    event.target.value = valor;
  
    // Actualizar el formulario
    this.productoInsertForm.patchValue({ input: valor });
  }
  
  mostrarLotes(){
    const modalRef = this.modalService.open(ModalLotesComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.PRODUCT_ID = this.PRODUCT_SELECTED
  }

  mostrarEscalas(){
    const modalRef = this.modalService.open(ModalEscalasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PRODUCT_ID = this.PRODUCT_SELECTED
  }
}
