import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ComprobanteService } from '../service/comprobante-service.service';

@Component({
  selector: 'app-create-comprobante',
  templateUrl: './create-comprobante.component.html',
  styleUrls: ['./create-comprobante.component.scss']
})
export class CreateComprobanteComponent {
  @Output() ComprobanteC:EventEmitter<any> = new EventEmitter();
      name:string = '';
    
      sweet:any = new SweetalertService
  
      constructor(
        public modal: NgbActiveModal,
        //llamamos al servicio
        public comprobanteService: ComprobanteService,
      ){
    
      }
    
      ngOnInit(): void {
      }
  
      store(){
        if(!this.name){
          this.sweet.formulario_invalido("Validacion","el nombre del comprobante es requerido");
          return false;
        }

        let data = {
          name: this.name
        }
    
        this.comprobanteService.registerComprobante(data).subscribe({
          next: (resp: any) => {
            // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
            if (resp.message == 403) {
              this.sweet.alerta('Error', resp.message_text);
            } else {
              this.ComprobanteC.emit(resp.comprobante_pago);
              this.modal.close();
              this.sweet.success('¡Éxito!', 'el comprobante se registró correctamente');
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
