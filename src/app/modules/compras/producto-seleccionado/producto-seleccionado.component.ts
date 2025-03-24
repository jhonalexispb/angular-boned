import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @Input() BONIFICACION:boolean = false
  @ViewChild('cantidad') cantidadInput: ElementRef
  DATA_PRODUCT_SELECTED:any = {
    'stock' : 0,
    'pventa' : 0.0,
    'pcompra' : 0.0,
    'lotes' : [],
    'escalas' :[]
  }

  isLoading:boolean = true

  tipoSeleccionado:any = 'menorIgual';
  precioMinimo: string;
  productoInsertForm: FormGroup;
  sweet:any = new SweetalertService
  errorMargen:boolean = false

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
      meses: [{ value: '', disabled: false }, Validators.required],
      margen_minimo: [this.LABORATORIO_ID.margen_minimo,[Validators.required,this.validarMargenMinimo.bind(this)]],
      condicion_vencimiento: [0],
      total:[{ value: '0.00', disabled: true }],
      ganancia:[{ value: '0.00', disabled: true }],
      bonificacion: [false]
    });

    if(this.BONIFICACION){
      this.productoInsertForm.get('pcompra')?.clearValidators();
      this.productoInsertForm.patchValue({pcompra: 0})
      this.productoInsertForm.patchValue({pventa: this.DATA_PRODUCT_SELECTED.pventa})
      this.productoInsertForm.patchValue({bonificacion: true})
    }

    this.productoInsertForm.get('cantidad')?.valueChanges.subscribe((valor) => {
      this.calcularTotal_Ganancia();
    });
  }

  ngAfterViewInit(): void {
    this.cantidadInput.nativeElement.focus();
  }

  calcularTotal_Ganancia(){
    const pcompra = this.productoInsertForm.get('pcompra')?.value;
    const cantidad = this.productoInsertForm.get('cantidad')?.value;
    const pventa = this.productoInsertForm.get('pventa')?.value;

    const total = parseFloat((pcompra * cantidad).toFixed(2));  // Convertir a número
    this.productoInsertForm.get('total')?.setValue(total, { emitEvent: false });

    const totalVenta = parseFloat((pventa * cantidad).toFixed(2));  // Convertir a número

    const ganancia = parseFloat((totalVenta - total).toFixed(2));  // Asegurar que sigue siendo número
    this.productoInsertForm.get('ganancia')?.setValue(ganancia, { emitEvent: false });
  }

  calcularPrecioVenta() {
    const pcompra = Number(this.productoInsertForm.get('pcompra')?.value) || 0;
    const margen = Number(this.productoInsertForm.get('margen_minimo')?.value) || 0;
  
    if(!this.BONIFICACION){
      if (pcompra <= 0) {
        this.productoInsertForm.patchValue({ pventa: null }, { emitEvent: false });
        this.productoInsertForm.get('pventa')?.disable();
        return;
      }
    }
  
    this.productoInsertForm.get('pventa')?.enable();
    const precioMinimo = pcompra + (pcompra * margen / 100);

    this.precioMinimo = precioMinimo.toFixed(2);
    this.productoInsertForm.patchValue(
      { pventa: precioMinimo.toFixed(2) },
      { emitEvent: false }
    );
  }

  calcularMargenMinimo() {
    const pcompra = Number(this.productoInsertForm.get('pcompra')?.value) || 0;
    const pventa = Number(this.productoInsertForm.get('pventa')?.value) || 0;
    
    if (pcompra <= 0 || pventa <= 0) {
      this.productoInsertForm.patchValue({ margen_minimo: null }, { emitEvent: false });
      return;
    }
    
    const margen = ((pventa - pcompra) / pcompra) * 100;

    const precioMinimo = pcompra + (pcompra * margen / 100);
    this.precioMinimo = precioMinimo.toFixed(2);
    
    this.productoInsertForm.patchValue(
      { margen_minimo: margen.toFixed(2) },
      { emitEvent: false }
    );
  }

  validarPrecioMinimo(control: any) {
    /* if (!this.productoInsertForm) return null;
    if (!control.value) return null;
  
    const pcompra = Number(this.productoInsertForm.get('pcompra')?.value);
    const margen = Number(this.productoInsertForm.get('margen_minimo')?.value) || 0;
    const precioMinimo = pcompra + (pcompra * margen / 100);
    const precioMinimoFormateado = precioMinimo.toFixed(2);
    const precioMinimoNumero = parseFloat(precioMinimoFormateado)
  
    return control.value < precioMinimoNumero ? { precioInvalido: true } : null; */
  }

  validarMargenMinimo(control: any) {
    this.errorMargen = false
    if (!control.value) return null; 
    if(control.value < 0){
      this.errorMargen = true
    }
  }

  onSubmit(): void {
    if(this.errorMargen){
      this.sweet.formulario_invalido('Algo no cuadra','el margen no puede ser negativo')
      return
    }
    if (this.productoInsertForm.valid) {
      this.ProductoComprado.emit(this.productoInsertForm.getRawValue());
      this.modal.close();
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  seleccionarTipo(tipo: string) {
    this.tipoSeleccionado = tipo;
    this.productoInsertForm.patchValue({
      fecha_vencimiento: null,
      condicion_vencimiento: tipo === 'igual' ? 1 : 0 // 1 para 'igual', 0 para 'menorIgual'
    });

    if (tipo === 'menorIgual') {
      this.productoInsertForm.get('fecha_vencimiento')?.disable();
      this.productoInsertForm.get('meses')?.enable();
      this.productoInsertForm.get('meses')?.setValidators([Validators.required]);
    } else {
      this.productoInsertForm.get('fecha_vencimiento')?.enable();
      this.productoInsertForm.get('meses')?.disable();
      this.productoInsertForm.get('meses')?.clearValidators();
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
    valor = valor.replace(/[^0-9.]/g, '');
    let partes = valor.split('.');
    if (partes.length > 2) {
      valor = partes[0] + '.' + partes.slice(1).join('');
    }
    if (valor.startsWith('.')) {
      valor = '0' + valor;
    }

    if (partes.length === 2) {
      partes[1] = partes[1].substring(0, 2);
      valor = partes.join('.');
    }
    event.target.value = valor;
    this.productoInsertForm.patchValue({ input: valor });

    switch(input){
      case 'pcompra':
        this.calcularPrecioVenta()
        break
      case 'pventa':
        this.calcularMargenMinimo()
        break
      case 'margen_minimo':
        this.calcularPrecioVenta()
        break
    }

    this.calcularTotal_Ganancia()
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
