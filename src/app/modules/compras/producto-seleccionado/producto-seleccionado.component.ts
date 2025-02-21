import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RucService } from '../../clientes/ruc/service/ruc.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CompraService } from '../service/compra.service';

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
  DATA_PRODUCT_SELECTED:any

  tipoSeleccionado:any;
  precioMinimo: number;
  productoInsertForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public rucService: RucService,
    public compraService: CompraService
  ) {}

  ngOnInit(): void {
    this.compraService.obtenerDetalleProducto(this.PRODUCTO_ID).subscribe((resp: any) => {
      this.DATA_PRODUCT_SELECTED = resp
    });
    this.productoInsertForm = this.fb.group({
      cantidad: [
        '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)] // Solo números enteros positivos (>0)
      ],      
      pcompra: [
        '',
        [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d+)?$/)]
      ],      
      pventa: [
        '',
        [Validators.required, this.validarPrecioMinimo.bind(this)]
      ],      
      fecha_vencimiento: ['', Validators.required], 
      meses: [{ value: '', disabled: true }] 
    });

    this.productoInsertForm.get('pcompra')?.valueChanges.subscribe((valor) => {
      this.calcularPrecioVenta(valor);
    });
  }

  calcularPrecioVenta(pcompra: any) {
    // Verificar si pcompra es un número válido
    if (!pcompra || isNaN(Number(pcompra))) {
      return;
    }
  
    const margen = this.LABORATORIO_ID?.margen_minimo || 0; // Asegurar que haya un margen válido
    this.precioMinimo = Number(pcompra) + (Number(pcompra) * margen / 100); // Convertir pcompra a número
  
    this.productoInsertForm.patchValue({ pventa: this.precioMinimo.toFixed(2) });
  }

  validarPrecioMinimo(control: any) {
    if (!this.productoInsertForm) return null; // Evitar errores en la inicialización
  
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
  
    if (tipo === 'menorIgual') {
      this.productoInsertForm.get('fecha_vencimiento')?.disable();
      this.productoInsertForm.get('meses')?.enable();
    } else {
      this.productoInsertForm.get('fecha_vencimiento')?.enable();
      this.productoInsertForm.get('meses')?.disable();
    }
  }
  

  cambiarEstadoFecha() {
    if (this.tipoSeleccionado === 'menorIgual') {
      this.productoInsertForm.get('fecha_vencimiento')?.disable();
    } else {
      this.productoInsertForm.get('fecha_vencimiento')?.enable(); 
    }
  }

  calcularFecha() {
    const meses = this.productoInsertForm.get('meses')?.value;
  
    if (!meses || meses < 1) {
      this.productoInsertForm.patchValue({ fecha_vencimiento: null });
      return;
    }
  
    let fechaActual = new Date();
    let mesDestino = fechaActual.getMonth() + meses; // Sumamos los meses
    let añoDestino = fechaActual.getFullYear();
  
    // Ajustamos el año si el mes supera diciembre
    if (mesDestino > 11) {
      añoDestino += Math.floor(mesDestino / 12);
      mesDestino = mesDestino % 12;
    }
  
    // Obtener el último día del mes calculado
    let fechaVencimiento = new Date(añoDestino, mesDestino + 1, 0);
  
    // Formatear manualmente la fecha (universal)
    const año = fechaVencimiento.getFullYear();
    const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0'); // Asegura dos dígitos
    const dia = String(fechaVencimiento.getDate()).padStart(2, '0'); // Asegura dos dígitos
    const fechaFormateada = `${año}-${mes}-${dia}`; // yyyy-MM-dd
    this.productoInsertForm.patchValue({ fecha_vencimiento: fechaFormateada });
  }

  validarNumero(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(key)) {
      event.preventDefault();
    }
  }

  validarPrecio(event: any) {
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
    this.productoInsertForm.patchValue({ pcompra: valor });
  }
  
  
}
