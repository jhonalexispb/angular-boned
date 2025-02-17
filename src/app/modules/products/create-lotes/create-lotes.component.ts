import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { AtributteProductsService } from '../service/atributte-products.service';

@Component({
  selector: 'app-create-lotes',
  templateUrl: './create-lotes.component.html',
  styleUrls: ['./create-lotes.component.scss']
})
export class CreateLotesComponent {
  @Input() PRODUCT_ID:any;
  @Output() LoteC: EventEmitter<any> = new EventEmitter();

  loteForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public productAtributteService: AtributteProductsService,
  ){
    
  }
  
  ngOnInit(): void {
    this.loteForm = this.fb.group({
      lote: ['',[Validators.required]],
      fecha_vencimiento: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loteForm.valid) {
      this.productAtributteService.registerLotes(this.PRODUCT_ID.id,this.loteForm.value).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          this.LoteC.emit(resp);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'el lote se registró correctamente'
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
