import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ComprobanteService } from '../service/comprobante-service.service';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';
import { SweetComprobante } from '../service/sweetComprobante.service';

@Component({
  selector: 'app-edit-comprobante',
  templateUrl: './edit-comprobante.component.html',
  styleUrls: ['./edit-comprobante.component.scss']
})
export class EditComprobanteComponent {
  @Output() ComprobanteE:EventEmitter<any> = new EventEmitter();
    @Input() COMPROBANTE_SELECTED:any;
  
    name:string = '';
    state:number = 1;
    gender: string = '';
  
    sweet:any = new SweetalertService
    sweetComprobante:any = new SweetComprobante
  
    permisions:any = [];
    constructor(
      public modal: NgbActiveModal,
      //llamamos al servicio
      public comprobanteService: ComprobanteService,
      private userLocalStorageService:  UserLocalStorageService
    ){
  
    }
  
    ngOnInit(): void {
      this.name = this.COMPROBANTE_SELECTED.name;
      this.state = this.COMPROBANTE_SELECTED.state;
      this.gender = this.userLocalStorageService.getUserGender();
    }
  
  
    store(){
      if(!this.name){
        this.sweet.formulario_invalido("Validacion","el nombre del comprobante es requerido");
        return false;
      }

      if(this.state == 2){
        const genero = this.gender === 'FEMENINO' 
        ? "seguro"
        : "segura";
        this.sweetComprobante.confirmar_estado_deshabilidato("¡Atención!",`¿Estás ${genero} de deshabilitar el comprobante: ${this.name} PARA TODOS LOS BANCOS?`);
        this.sweetComprobante.getConfirmationObservable().subscribe((confirmed:boolean) => {
          if (confirmed) {
            this.procederConActualizacion();
          }
        });
        return false;
      }else {
        this.procederConActualizacion();
      }
    }
  
    procederConActualizacion() {
      let data = {
        name: this.name,
        state: this.state
      }
  
      this.comprobanteService.updateComprobante(this.COMPROBANTE_SELECTED.id, data).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 403) {
            this.sweet.alerta('Error', resp.message_text);
          } else {
            this.ComprobanteE.emit(resp.comprobante_pago);
            this.modal.close();
            this.sweet.success('¡Éxito!', 'el comprobante se actualizó correctamente');
          }
        },
        error: (error) => {
          // Lógica cuando ocurre un error
          this.sweet.error(error.status);
          //console.log(error.status)
        },
      });
    }
}
