import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateComprobanteComponent } from '../../comprobante/create-comprobante/create-comprobante.component';
import { BankService } from '../service/bank-service.service';

@Component({
  selector: 'app-edit-relacion-banco-comprobante',
  templateUrl: './edit-relacion-banco-comprobante.component.html',
  styleUrls: ['./edit-relacion-banco-comprobante.component.scss']
})
export class EditRelacionBancoComprobanteComponent {
  @Output() relacionBancoComprobanteE:EventEmitter<any> = new EventEmitter();
  @Input() BANK_RELATION_SELECTED:any;
  COMPROBANTES:any = []
  name:string = '';
  loading:boolean = false

  miImagenActual: string | ArrayBuffer | null = null;
  relacionBancoComprobanteForm: FormGroup;
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
      id_banco:[this.BANK_RELATION_SELECTED.id_bank, [Validators.required]],
      id_comprobante_pago:[this.BANK_RELATION_SELECTED.comprobante.id, [Validators.required]],
      tipo_caracter: [this.BANK_RELATION_SELECTED.tipo_caracter, [Validators.required]],
      ncaracteres: [this.BANK_RELATION_SELECTED.ncaracteres, [Validators.required]],
      ubicacion_codigo: [this.BANK_RELATION_SELECTED.ubicacion_codigo],
      state: [this.BANK_RELATION_SELECTED.state_relacion],
      img_ejemplo_relation: [null],
      keep_existing_image: ["true"],
    });
    this.miImagenActual = this.BANK_RELATION_SELECTED.img_ejemplo
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
      const formData = new FormData();

      for (const key in this.relacionBancoComprobanteForm.value) {
        if (this.relacionBancoComprobanteForm.value[key]) {
          formData.append(key, this.relacionBancoComprobanteForm.value[key]);
        }
      }

      this.bankService.updateRelacionBancoComprobante(this.BANK_RELATION_SELECTED.id_relacion,formData).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
            this.relacionBancoComprobanteE.emit(resp.relacionBancoComprobante);
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la relacion se actulizo correctamente'
            );
        },
      })
    }
  }

  onImageSelected(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.miImagenActual = reader.result;
      this.relacionBancoComprobanteForm.patchValue({
        img_ejemplo_relation: file
      });
    };
    reader.readAsDataURL(file);
  }

  onImageDeleted(): void {
    this.miImagenActual = null;
    this.relacionBancoComprobanteForm.setValue({
      ...this.relacionBancoComprobanteForm.value, // Mantiene los valores actuales
      img_ejemplo_relation: null,
      keep_existing_image: "false"
    });
  }
}
