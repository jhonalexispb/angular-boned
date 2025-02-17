import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { AtributteProductsService } from '../service/atributte-products.service';

@Component({
  selector: 'app-edit-lotes',
  templateUrl: './edit-lotes.component.html',
  styleUrls: ['./edit-lotes.component.scss']
})
export class EditLotesComponent {
  
  @Input() LOTE_ID_SELECTED:any;
  @Input() PRODUCT_SELECTED:any;
  @Output() LoteE: EventEmitter<any> = new EventEmitter();

  loteForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public productAtributteService: AtributteProductsService,
  ){
    
  }
  
  ngOnInit(): void {
    const fechaFormateada = this.LOTE_ID_SELECTED.fecha_vencimiento.substring(0, 10);
    this.loteForm = this.fb.group({
      lote: [this.LOTE_ID_SELECTED.lote,[Validators.required]],
      fecha_vencimiento: [fechaFormateada, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loteForm.valid) {
      this.productAtributteService.updateLote(this.PRODUCT_SELECTED.id,this.LOTE_ID_SELECTED.id,this.loteForm.value).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          this.LoteE.emit(resp);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'el lote se actualizó correctamente'
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
