import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { PresentacionesService } from '../service/presentaciones.service';

@Component({
  selector: 'app-create-presentaciones',
  templateUrl: './create-presentaciones.component.html',
  styleUrls: ['./create-presentaciones.component.scss']
})
export class CreatePresentacionesComponent {
  @Output() PresentacionC: EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo: any = '';
  name: string = '';
  sweet: any = new SweetalertService();

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public presentacionService: PresentacionesService
  ) {}

  ngOnInit(): void {
    this.name = this.nombre_externo
  }

  store() {
    if (!this.name) {
      this.sweet.formulario_invalido(
        'Validacion',
        'el nombre de la presentacion es requerida'
      );
      return false;
    }

    const formData = new FormData();
    formData.append('name', this.name);

    this.presentacionService.registerPresentacion(formData).subscribe({
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
          this.PresentacionC.emit(resp.presentacion);
          this.modal.close();
          this.sweet.success(
            '¡Éxito!',
            'la presentacion se registró correctamente'
          );
        }
      },
    });
  }

  restaurar(prov: any) {
    this.presentacionService.restaurarPresentacion(prov).subscribe({
      next: (resp: any) => {
        this.PresentacionC.emit(resp.presentacion_restaurada);
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
