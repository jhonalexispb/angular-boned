import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CondicionAlmacenamientoService } from '../service/condicion-almacenamiento.service';

@Component({
  selector: 'app-edit-condiciones-almacenamiento',
  templateUrl: './edit-condiciones-almacenamiento.component.html',
  styleUrls: ['./edit-condiciones-almacenamiento.component.scss']
})
export class EditCondicionesAlmacenamientoComponent {
  @Output() CondicionE: EventEmitter<any> = new EventEmitter();
  @Input() CONDICION_SELECTED: any = [];
  name: string = '';
  state: string;

  sweet: any = new SweetalertService();

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public condicionService: CondicionAlmacenamientoService
  ) {}

  ngOnInit(): void {
    (this.name = this.CONDICION_SELECTED.name),
    (this.state = this.CONDICION_SELECTED.state)
  }

  store() {
    if (!this.name) {
      this.sweet.formulario_invalido(
        'Validacion',
        'el nombre de la condicion es requerida'
      );
      return false;
    }

    const data = {
      name: this.name,
      state: this.state
    }

    this.condicionService
      .updateCondiciones(this.CONDICION_SELECTED.id, data)
      .subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 409) {
            this.sweet.confirmar_restauracion('Atencion', resp.message_text);
            this.sweet
              .getRestauracionObservable()
              .subscribe((confirmed: boolean) => {
                if (confirmed) {
                  this.restaurar(resp.condicion_almacenamiento);
                }
              });
          } else {
            this.CondicionE.emit({
              condicion: resp.condicion_almacenamiento,
              isRestored: false,
            });
            this.modal.close();
            this.sweet.success(
              '¡Éxito!',
              'la condicion de almacenamiento se actualizo correctamente'
            );
          }
        },
      });
  }

  restaurar(cat: any) {
    this.condicionService.restaurarCondicion(cat).subscribe({
      next: (resp: any) => {
        this.CondicionE.emit({
          condicion: resp.condicion_almacenamiento_restaurada,
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
