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
    console.log(this.PRODUCT_SELECTED)
    this.productoInsertForm = this.fb.group({ 
      guia_prestamo_id: [
        '',
        [Validators.required] // Solo números enteros positivos (>0)
      ],  
      producto_id: [
        this.PRODUCT_SELECTED.id,
        [Validators.required] // Solo números enteros positivos (>0)
      ],    
      cantidad: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)] // Solo números enteros positivos (>0)
      ],  
      pventa: [
        { value: 'Consutando precio de venta', disabled: true },
        [Validators.required, Validators.min(0.01)]
      ],           
      lote_id: [null], 
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
    if (this.productoInsertForm.valid) {
      this.ProductoGestionado.emit(this.productoInsertForm.getRawValue());
      this.modal.close();
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  validarNumero(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(key)) {
      event.preventDefault();
    }
  }
}
