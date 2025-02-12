import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { PresentacionesService } from '../service/presentaciones.service';

@Component({
  selector: 'app-edit-presentaciones',
  templateUrl: './edit-presentaciones.component.html',
  styleUrls: ['./edit-presentaciones.component.scss']
})
export class EditPresentacionesComponent {
  @Output() PresentacionE: EventEmitter<any> = new EventEmitter();
  @Input() PRESENTACION_SELECTED: any = [];
  name: string = '';
  state: string;

  sweet: any = new SweetalertService();

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public presentacionService: PresentacionesService
  ) {}

  ngOnInit(): void {
    (this.name = this.PRESENTACION_SELECTED.name),
    (this.state = this.PRESENTACION_SELECTED.state)
  }

  store() {
    if (!this.name) {
      this.sweet.formulario_invalido(
        'Validacion',
        'el nombre de la presentacion es requerida'
      );
      return false;
    }

    const data = {
      name: this.name,
      state: this.state
    }

    this.presentacionService
      .updatePresentacion(this.PRESENTACION_SELECTED.id, data)
      .subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 409) {
            this.sweet.confirmar_restauracion('Atencion', resp.message_text);
            this.sweet
              .getRestauracionObservable()
              .subscribe((confirmed: boolean) => {
                if (confirmed) {
                  this.restaurar(resp.presentacion);
                }
              });
          } else {
            this.PresentacionE.emit({
              presentacion: resp.presentacion,
              isRestored: false,
            });
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la presentacion se actualizo correctamente'
            );
          }
        },
      });
  }

  restaurar(p: any) {
    this.presentacionService.restaurarPresentacion(p).subscribe({
      next: (resp: any) => {
        this.PresentacionE.emit({
          presentacion: resp.presentacion_restaurada,
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
