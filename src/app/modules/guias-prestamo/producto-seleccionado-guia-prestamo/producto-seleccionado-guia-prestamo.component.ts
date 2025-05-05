import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { GuiaPrestamoService } from '../service/guia-prestamo.service';

@Component({
  selector: 'app-producto-seleccionado-guia-prestamo',
  templateUrl: './producto-seleccionado-guia-prestamo.component.html',
  styleUrls: ['./producto-seleccionado-guia-prestamo.component.scss']
})
export class ProductoSeleccionadoGuiaPrestamoComponent {
  @Output() ProductoGestionado: EventEmitter<any> = new EventEmitter();
  @Input() PRODUCT_SELECTED:any
  @Input() GUIA_PRESTAMO_ID:any
  @ViewChild('cantidad') cantidadInput: ElementRef
  DATA_PRODUCT_SELECTED:any = {
    'stock' : 'Consultando stock',
    'pventa' : '',
    'lotes' : [],
  }

  isLoading:boolean = true
  productoInsertForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    public guia_prestamo_service: GuiaPrestamoService
  ) {}

  ngOnInit(): void {
    this.productoInsertForm = this.fb.group({ 
      guia_prestamo_id: [this.GUIA_PRESTAMO_ID],
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
      lote_id: [null], 
      total:['0.00']
    });

    this.guia_prestamo_service.obtenerDetalleProducto(this.PRODUCT_SELECTED.id).subscribe((resp: any) => {
      this.DATA_PRODUCT_SELECTED = resp;
      this.productoInsertForm.patchValue({
        pventa: this.DATA_PRODUCT_SELECTED.pventa
      });
      if(this.DATA_PRODUCT_SELECTED.lotes.length == 1){
        this.productoInsertForm.patchValue({
          lote_id: this.DATA_PRODUCT_SELECTED.lotes[0].id
        });
      }
      this.isLoading = false;
    });

    this.productoInsertForm.get('cantidad')?.valueChanges.subscribe((valor) => {
      const pventa:any = this.productoInsertForm.get('pventa')?.value;
      const total = (pventa * valor).toFixed(2);
      this.productoInsertForm.patchValue(
        { total: total }
        , { emitEvent: false }
      );
    });
  }

  ngAfterViewInit(): void {
    this.cantidadInput.nativeElement.focus();
  }

  onSubmit(): void {
    const cantidad = Number(this.productoInsertForm.get('cantidad')?.value);
    const loteId = this.productoInsertForm.get('lote_id')?.value;

    if (loteId) {
      const lote = this.DATA_PRODUCT_SELECTED.lotes.find((l: any) => l.id === Number(loteId));
      const stockLote = lote ? Number(lote.cantidad) : 0;

      if (cantidad > stockLote) {
        this.sweet.alerta(
          'Atención',
          `stock del lote insuficiente, solo hay ${stockLote}`
        );
        return;
      }
    }

    const stockProducto = Number(this.DATA_PRODUCT_SELECTED.stock);

    if (cantidad > stockProducto) {
      this.sweet.alerta(
        'Atención',
        `stock del producto insuficiente, solo hay ${stockProducto}`
      );
      return;
    }

    if (this.productoInsertForm.valid) {
      this.guia_prestamo_service.registerMovimientoGuiaPrestamo(this.productoInsertForm.value).subscribe((resp: any) => {
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
}
