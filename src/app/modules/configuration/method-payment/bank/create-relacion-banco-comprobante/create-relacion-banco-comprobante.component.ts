import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { BankService } from '../service/bank-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateComprobanteComponent } from '../../comprobante/create-comprobante/create-comprobante.component';

@Component({
  selector: 'app-create-relacion-banco-comprobante',
  templateUrl: './create-relacion-banco-comprobante.component.html',
  styleUrls: ['./create-relacion-banco-comprobante.component.scss']
})
export class CreateRelacionBancoComprobanteComponent {
  @Output() relacionBancoComprobanteC:EventEmitter<any> = new EventEmitter();
  @Input() BANK_RELATION_SELECTED:any;
  COMPROBANTES:any = []
  name:string = '';
  file_name:any
  imagen_previzualizade:any;
  mainImage: string | ArrayBuffer | null = null;
  loading:boolean = false

  relacionBancoComprobanteForm: FormGroup;

  mainImageConfig = {
    url: 'https://httpbin.org/post',
    maxFilesize: 5,
    acceptedFiles: 'image/*',
    maxFiles: 1,
    useDropzoneClass: 'image-input-placeholder',
  };

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    private fb: FormBuilder,
    //llamamos al servicio
    public bankService: BankService,
  ){

  }

  ngOnInit(): void {
    this.loading = true
    this.bankService.obtenerRecursos().subscribe((data: any) => {
      this.COMPROBANTES = data.comprobantes;
      this.loading = false
    });
    this.relacionBancoComprobanteForm = this.fb.group({
      id_banco:[this.BANK_RELATION_SELECTED.id, [Validators.required]],
      id_comprobante_pago:[null, [Validators.required]],
      tipo_caracter: ['1', [Validators.required]],
      ncaracteres: ['', [Validators.required]],
      ubicacion_codigo: [''],
      img_ejemplo_relation: [null]
    });
  }

  createComprobante(){
    const modalRef = this.modalService.open(CreateComprobanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ComprobanteC.subscribe((r: any) => {
      this.COMPROBANTES = [r, ...this.COMPROBANTES];
      this.relacionBancoComprobanteForm.patchValue({ id_comprobante_pago: r.id });
    });
  }

  onSubmit(){
    if (this.relacionBancoComprobanteForm.valid) {
      console.log('Formulario enviado', this.relacionBancoComprobanteForm.value);
      this.bankService.registrarRelacionBancoComprobante(this.relacionBancoComprobanteForm.value).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
            this.relacionBancoComprobanteC.emit(resp.relacionBancoComprobante);
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la relacion se registró correctamente'
            );
            console.log(resp.relacionBancoComprobante)
        },
      })
    }
  }

  // Evento para manejar éxito de carga de la imagen principal
  onMainImageUploadSuccess(event: any): void {
    const file = event[0].dataURL;
    this.relacionBancoComprobanteForm.patchValue({
      img_ejemplo_relation: file
    });
  }

  // Evento para manejar error de carga de la imagen principal
  onMainImageUploadError(event: any): void {
    console.error('Error al cargar la imagen principal', event);
  }
}
