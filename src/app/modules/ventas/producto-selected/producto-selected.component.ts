import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { VentasService } from '../service/ventas.service';

@Component({
  selector: 'app-producto-selected',
  templateUrl: './producto-selected.component.html',
  styleUrls: ['./producto-selected.component.scss']
})
export class ProductoSelectedComponent {
  @Output() ProductoGestionado: EventEmitter<any> = new EventEmitter();
  @Input() PRODUCT_SELECTED:any
  @Input() ORDER_VENTA_ID:any
  @ViewChild('cantidad') cantidadInput: ElementRef
  DATA_PRODUCT_SELECTED:any = {
    'stock' : 'Consultando stock',
    'pventa' : '',
    'lotes' : [],
    'escalas' :[]
  }

  isLoading:boolean = true
  productoInsertForm: FormGroup;
  sweet:any = new SweetalertService
  errorMargen:boolean = false
  escalaAplicada: any = null;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    public orden_venta_service: VentasService
  ) {}

  ngOnInit(): void {
    this.productoInsertForm = this.fb.group({ 
      orden_venta_id: [this.ORDER_VENTA_ID],
      producto_id: [
        this.PRODUCT_SELECTED.id,
        [Validators.required] // Solo números enteros positivos (>0)
      ],    
      cantidad: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)] // Solo números enteros positivos (>0)
      ],  
      pventa: [
        { value: 'Consultando precio de venta', disabled: true },
        [Validators.required, Validators.min(0.01)]
      ],           
      total:['0.00'],
      ganancia:[0],
      margen: [30]
    });

    this.orden_venta_service.obtenerDetalleProducto(this.PRODUCT_SELECTED.id).subscribe((resp: any) => {
      this.DATA_PRODUCT_SELECTED = resp;
      this.productoInsertForm.patchValue({
        pventa: this.DATA_PRODUCT_SELECTED.pventa
      });
      this.isLoading = false;
    });

    this.productoInsertForm.get('cantidad')?.valueChanges.subscribe((valor) => {
      const cantidad = parseInt(valor, 10);

      // Si cantidad no es un número válido, asigna 0
      const cantidadValida = isNaN(cantidad) ? 0 : cantidad;

      // Obtener precio según la escala
      const { precio, escala } = this.getPrecioEscala(cantidadValida);

      // Actualizar precio si aplica una escala
      this.productoInsertForm.patchValue(
        { pventa: precio.toFixed(2) },
        { emitEvent: false }
      );

      // Calcular total
      const total = (precio * cantidadValida).toFixed(2);

      this.productoInsertForm.patchValue(
        { total: total },
        { emitEvent: false }
      );

      // (Opcional) podrías guardar escala para mostrarla
      this.escalaAplicada = escala;
      this.calcularTotal_Ganancia();
    });

    this.productoInsertForm.get('margen')?.valueChanges.subscribe(() => {
      this.calcularTotal_Ganancia();
    });
  }

  ngAfterViewInit(): void {
    this.cantidadInput.nativeElement.focus();
  }

  onSubmit(): void {
    const cantidad = Number(this.productoInsertForm.get('cantidad')?.value);
    const stockProducto = Number(this.DATA_PRODUCT_SELECTED.stock);

    if (cantidad > stockProducto) {
      this.sweet.alerta(
        'Atención',
        `stock del producto insuficiente, solo hay ${stockProducto}`
      );
      return;
    }

    if (this.productoInsertForm.valid) {
      this.orden_venta_service.registerMovimientoOrdenVenta(this.productoInsertForm.value).subscribe((resp: any) => {
        this.ProductoGestionado.emit(resp.movimiento);
        this.modal.close();
      });
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault(); // Prevenir comportamiento por defecto
    if (this.productoInsertForm.valid) {
      this.onSubmit();
    }
  }

  validarNumero(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(key)) {
      event.preventDefault();
    }
  }

  getPrecioEscala(cantidad: number): { precio: number, escala: any | null } {
    const escalas = this.DATA_PRODUCT_SELECTED.escalas;

    if (!escalas || escalas.length === 0) {
      return {
        precio: parseFloat(this.DATA_PRODUCT_SELECTED.pventa) || 0,
        escala: null
      };
    }

    const escalasOrdenadas = escalas.sort((a: any, b: any) => a.cantidad - b.cantidad);

    let precioAplicado = parseFloat(this.DATA_PRODUCT_SELECTED.pventa);
    let escalaSeleccionada = null;

    for (let escala of escalasOrdenadas) {
      if (cantidad >= escala.cantidad) {
        precioAplicado = parseFloat(escala.precio);
        escalaSeleccionada = escala;
      } else {
        break;
      }
    }

    return { precio: precioAplicado, escala: escalaSeleccionada };
  }

  calcularTotal_Ganancia() {
    const cantidad = parseInt(this.productoInsertForm.get('cantidad')?.value, 10) || 0;
    const pventa = parseFloat(this.productoInsertForm.get('pventa')?.value) || 0;
    const margen = parseFloat(this.productoInsertForm.get('margen')?.value) || 0;

    const total = cantidad * pventa;
    this.productoInsertForm.patchValue({ total: total.toFixed(2) }, { emitEvent: false });

    const gananciaCalculada = total * (margen / 100);
    this.productoInsertForm.patchValue(
        { ganancia: gananciaCalculada.toFixed(2) },
        { emitEvent: false }
      );
  }
}