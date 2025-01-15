import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { PrincipiosActivosServiceService } from '../service/principios-activos-service.service';

@Component({
  selector: 'app-edit-principio-activo',
  templateUrl: './edit-principio-activo.component.html',
  styleUrls: ['./edit-principio-activo.component.scss']
})
export class EditPrincipioActivoComponent {
   @Output() PrincipioActivoE:EventEmitter<any> = new EventEmitter();
   @Input() PRINCIPIO_ACTIVO_SELECTED:any = [];
  PRINCIPIOS_ACTIVOS:any[] = [];
  concentracion:string = '';
  principio_activo:string;
  state:number
  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public principioActivoService: PrincipiosActivosServiceService,
  ){

  }

  ngOnInit(): void {
    this.principio_activo = this.PRINCIPIO_ACTIVO_SELECTED.name,
    this.concentracion = this.PRINCIPIO_ACTIVO_SELECTED.concentracion,
    this.state = this.PRINCIPIO_ACTIVO_SELECTED.state,
    this.principioActivoService.obtenerRecursos().subscribe((data: any) => {
      this.PRINCIPIOS_ACTIVOS = data.nombres_principios_activos;
    });
  }

  store(){

    if(!this.principio_activo){
      this.sweet.formulario_invalido("Validacion","el nombre del principio activo es requerido");
      return false;
    }

    const data = {
      name: this.principio_activo,
      concentracion: this.concentracion,
      state: this.state
    }

    this.principioActivoService.updatePrincipioActivo(this.PRINCIPIO_ACTIVO_SELECTED.id,data).subscribe({
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
          this.PrincipioActivoE.emit({principioActivo:resp.principio_activo, isRestored: false});
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el principio activo se registró correctamente');
        }
      },
    });
  }

  restaurar(prov:any){
    this.principioActivoService.restaurarPrincipioActivo(prov).subscribe({
      next: (resp: any) => {
          this.PrincipioActivoE.emit({principioActivo:resp.principio_activo_restaurado, isRestored: true});
          this.modal.close();
          this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      },
    })
  }
}
