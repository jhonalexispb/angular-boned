import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CompraService } from '../../service/compra.service';

@Component({
  selector: 'app-crear-lotes',
  templateUrl: './crear-lotes.component.html',
  styleUrls: ['./crear-lotes.component.scss']
})
export class CrearLotesComponent {
  @Input() PRODUCT_ID:any;
  @Input() CANTIDAD_PENDIENTE_LOTE:any;
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
    if(this.loteForm.get('cantidad')?.value > this.CANTIDAD_PENDIENTE_LOTE){
      this.sweet.alerta('Ups',`Solo quedan ${this.CANTIDAD_PENDIENTE_LOTE} por gestionar`);
      return
    }

    if (this.loteForm.valid) {
      this.LoteC.emit(this.loteForm.value);
      this.modal.close();
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

export interface Lote {
  id: number;
  lote: string;
  fecha_vencimiento: string; // O Date si prefieres usar un objeto de fecha
}
