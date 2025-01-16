import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { RucService } from '../service/ruc.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-ruc',
  templateUrl: './create-ruc.component.html',
  styleUrls: ['./create-ruc.component.scss']
})
export class CreateRucComponent {
  @Output() RucC: EventEmitter<any> = new EventEmitter();

  rucForm: FormGroup;
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    //llamamos al servicio
    public rucService: RucService
  ) {}

  ngOnInit(): void {
    this.rucForm = this.fb.group({
      ruc: [
        '',
        [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d+$/)]
      ],
      razonSocial: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.rucForm.valid) {
      this.rucService.registerRuc(this.rucForm.value).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
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
            this.RucC.emit(resp.cliente);
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'el ruc se registró correctamente'
            );
          }
        },
      });
    } else {
      this.sweet.formulario_invalido(
        'Validacion',
        'Existen errores en tu formulario'
      );
    }
  }

  restaurar(prov: any) {
    this.rucService.restaurarRuc(prov).subscribe({
      next: (resp: any) => {
        this.RucC.emit(resp.cliente_restaurado);
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
