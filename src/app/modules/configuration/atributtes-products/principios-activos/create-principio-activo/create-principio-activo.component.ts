import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { PrincipiosActivosServiceService } from '../service/principios-activos-service.service';

@Component({
  selector: 'app-create-principio-activo',
  templateUrl: './create-principio-activo.component.html',
  styleUrls: ['./create-principio-activo.component.scss']
})
export class CreatePrincipioActivoComponent {
  @Output() PrincipioActivoC:EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo: any = '';
  PRINCIPIOS_ACTIVOS:any[] = [];
  concentracion:string = '';
  principio_activo:string
  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public principioActivoService: PrincipiosActivosServiceService,
  ){

  }

  ngOnInit(): void {
    this.principio_activo = this.nombre_externo
    this.loading = true;
    this.principioActivoService.obtenerRecursos().subscribe((data: any) => {
      this.PRINCIPIOS_ACTIVOS = data.nombres_principios_activos;
      this.loading = false;
    });
  }

  store(){

    if(!this.principio_activo){
      this.sweet.formulario_invalido("Validacion","el nombre del principio activo es requerido");
      return false;
    }

    const data = {
      name: this.principio_activo,
      concentracion: this.concentracion
    }

    this.principioActivoService.registerPrincipioActivo(data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.principio_activo);
            }
          })
        } else {
          this.PrincipioActivoC.emit(resp.principio_activo);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el principio activo se registró correctamente');
        }
      },
    });
  }

  restaurar(prov:any){
    this.principioActivoService.restaurarPrincipioActivo(prov).subscribe({
      next: (resp: any) => {
          this.PrincipioActivoC.emit(resp.principio_activo_restaurado);
          this.modal.close();
          this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      },
    })
  }
}
