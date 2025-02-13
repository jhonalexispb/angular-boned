import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { AtributteProductsService } from '../service/atributte-products.service';

@Component({
  selector: 'app-edit-escalas',
  templateUrl: './edit-escalas.component.html',
  styleUrls: ['./edit-escalas.component.scss']
})
export class EditEscalasComponent {
  @Input() ESCALA_ID_SELECTED:any;
  @Input() PRODUCT_SELECTED:any;
  @Output() EscalaE: EventEmitter<any> = new EventEmitter();

  escalaForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public productAtributteService: AtributteProductsService,
  ){
    
  }
  
  ngOnInit(): void {
    this.escalaForm = this.fb.group({
      cantidad: [
        this.ESCALA_ID_SELECTED.cantidad,
        [Validators.required, Validators.pattern(/^\d+$/)]
      ],
      precio: [this.ESCALA_ID_SELECTED.precio, [Validators.required, Validators.pattern(/^\d+(\.\d{1})?$/)]]
    });
  }

  onCantidadInput(event: any) {
    const value = event.target.value;
    // Solo permite números enteros
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
    }
  }

  onPrecioInput(event: any) {
    let value = event.target.value;

    value = value.replace(/[^0-9.]/g, '');
  
    // Evitar más de un decimal
    if ((value.match(/\./g) || []).length > 1) {
      value = value.slice(0, -1);  // Eliminar el último carácter si hay más de un punto decimal
    }
  
    // Limitar a un solo decimal
    if (value && value.indexOf('.') !== -1) {
      const parts = value.split('.');
      if (parts[1]?.length > 1) {
        value = parts[0] + '.' + parts[1].substring(0, 1);  // Limitar a un solo decimal
      }
    }
  
    event.target.value = value;  // Asignar el valor modificado
  }

  onSubmit(): void {
    if (this.escalaForm.valid) {
      this.productAtributteService.updateEscala(this.PRODUCT_SELECTED.id,this.ESCALA_ID_SELECTED.id,this.escalaForm.value).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          this.EscalaE.emit(resp);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'la escala se actualizó correctamente'
          );
        },
      });
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }
}
