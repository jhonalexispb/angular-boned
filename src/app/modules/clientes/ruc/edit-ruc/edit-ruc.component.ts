import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { RucService } from '../service/ruc.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-ruc',
  templateUrl: './edit-ruc.component.html',
  styleUrls: ['./edit-ruc.component.scss']
})
export class EditRucComponent {
  @Output() RucE: EventEmitter<any> = new EventEmitter();
  @Input() RUC_SELECTED: any = [];

  sweet: any = new SweetalertService();
  rucForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public rucService: RucService
  ) {}

  ngOnInit(): void {
    this.rucForm = this.fb.group({
      ruc: [
        this.RUC_SELECTED.ruc,  // Rellenar con el valor de RUC existente
        [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d+$/)]
      ],
      razonSocial: [
        this.RUC_SELECTED.razonSocial,  // Rellenar con el valor de Razón Social existente
        [Validators.required]
      ],
      state: [
        this.RUC_SELECTED.state,  // Rellenar con el valor de Razón Social existente
        []
      ],
    });
  }

  onSubmit(): void {
    if (this.rucForm.valid) {
      const data = this.rucForm.value;

      // Llamar al servicio para actualizar el RUC
      this.rucService.updateRuc(this.RUC_SELECTED.id,data).subscribe({
        next: (resp: any) => {
          if (resp.message == 409) {
            this.sweet.confirmar_restauracion('Atencion', resp.message_text);
            this.sweet
              .getRestauracionObservable()
              .subscribe((confirmed: boolean) => {
                if (confirmed) {
                  this.restaurar(resp.cliente);
                }
              });
          } else {
            this.RucE.emit({
              ruc: resp.cliente,
              isRestored: false,
            });
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'el cliente se actualizo correctamente'
            );
          }
        }
      });
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  restaurar(cat: any) {
    this.rucService.restaurarRuc(cat).subscribe({
      next: (resp: any) => {
        this.RucE.emit({
          ruc: resp.cliente_restaurado,
          isRestored: true,
        });
        this.modal.close();
        this.sweet.success(
          '¡Restaurado!',
          resp.message_text,
          '/assets/animations/general/restored.json'
        );
      },
    });
  }
}
