import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CompraService } from '../../service/compra.service';
import { Lote } from '../crear-lotes/crear-lotes.component';

@Component({
  selector: 'app-crear-registro-sanitario',
  templateUrl: './crear-registro-sanitario.component.html',
  styleUrls: ['./crear-registro-sanitario.component.scss']
})
export class CrearRegistroSanitarioComponent {
  @Input() PRODUCT_ID:any;
  @Output() LoteC: EventEmitter<any> = new EventEmitter();

  loteForm: FormGroup;
  sweet:any = new SweetalertService
  LOTES_LIST:Lote[] = []
  loading:boolean = true

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public compraService: CompraService,
  ){
    
  }
  
  ngOnInit(): void {
    this.compraService.obtenerLotes(this.PRODUCT_ID.producto_id).subscribe((resp: any) => {
      this.LOTES_LIST = resp
      this.loading = false
      console.log(resp)
    })

    this.loteForm = this.fb.group({
      tiene_lote: [true],
      tiene_fecha: [true],
      lote: [null,[Validators.required]],
      fecha_vencimiento: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
    });

    this.loteForm.get('tiene_lote')?.valueChanges.subscribe((tiene_lote) => {
      if(tiene_lote){
        this.loteForm.get('lote')?.setValidators([Validators.required]);
      } else {
        this.loteForm.get('lote')?.clearValidators();
      }
      this.loteForm.patchValue({
        lote: null,
      });
    });

    this.loteForm.get('tiene_fecha')?.valueChanges.subscribe((tiene_fecha) => {
      if(tiene_fecha){
        this.loteForm.get('fecha_vencimiento')?.setValidators([Validators.required]);
      } else {
        this.loteForm.get('fecha_vencimiento')?.clearValidators();
      }
      this.loteForm.patchValue({
        fecha_vencimiento: null,
      });
    });
  }

  onSubmit(): void {
    if(this.loteForm.get('lote')?.value == null && this.loteForm.get('fecha_vencimiento')?.value == null){
      this.sweet.alerta('Ups','No se registro datos, debido a que el producto no tiene ni lote, ni fecha de vencimiento');
      this.modal.close();
      return
    }

    if (this.loteForm.valid) {
      this.LoteC.emit(this.loteForm.value);
      this.modal.close();
      this.sweet.success(
        '¡Éxito!',
        'el lote se registró correctamente'
      );
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  onLoteSelected(event: any) {
    const loteSeleccionado = this.LOTES_LIST.find(lote => lote.id === event.id);
    if (loteSeleccionado) {
      this.loteForm.patchValue({
        fecha_vencimiento: loteSeleccionado.fecha_vencimiento
      }) 
    }
  }
}
