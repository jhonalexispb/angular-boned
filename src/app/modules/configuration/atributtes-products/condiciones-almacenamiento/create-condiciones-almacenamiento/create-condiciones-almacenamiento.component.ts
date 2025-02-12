import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CondicionAlmacenamientoService } from '../service/condicion-almacenamiento.service';

@Component({
  selector: 'app-create-condiciones-almacenamiento',
  templateUrl: './create-condiciones-almacenamiento.component.html',
  styleUrls: ['./create-condiciones-almacenamiento.component.scss']
})
export class CreateCondicionesAlmacenamientoComponent {
  @Output() CondicionC: EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo: any = '';
  name: string = '';
  sweet: any = new SweetalertService();

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public condicionService: CondicionAlmacenamientoService
  ) {}

  ngOnInit(): void {
    this.name = this.nombre_externo
  }

  store() {
    if (!this.name) {
      this.sweet.formulario_invalido(
        'Validacion',
        'el nombre de la condicion es requerida'
      );
      return false;
    }

    const formData = new FormData();
    formData.append('name', this.name);

    this.condicionService.registerCondicion(formData).subscribe({
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
          this.CondicionC.emit(resp.condicion_almacenamiento);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'la condicion de almacenamiento se registró correctamente'
          );
        }
      },
    });
  }

  restaurar(prov: any) {
    this.condicionService.restaurarCondicion(prov).subscribe({
      next: (resp: any) => {
        this.CondicionC.emit(resp.condicion_almacenamiento_restaurada);
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
