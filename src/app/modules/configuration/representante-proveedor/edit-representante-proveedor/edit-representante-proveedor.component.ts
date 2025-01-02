import { RepresentanteProveedorService } from './../service/representante-proveedor-service.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SweetRestaurarRepresentante } from '../service/restauracionAlert.service';

@Component({
  selector: 'app-edit-representante-proveedor',
  templateUrl: './edit-representante-proveedor.component.html',
  styleUrls: ['./edit-representante-proveedor.component.scss']
})
export class EditRepresentanteProveedorComponent {
  @Output() RepresentanteProveedorE:EventEmitter<any> = new EventEmitter();
    @Input() REPRESENTANTE_PROVEEDOR_SELECTED:any = [];
              name:string = '';
              celular:string = '';
              correo:string = '';
              state:string;
            
              sweet:any = new SweetalertService
              sweetRestaurarRepresentante:any = new SweetRestaurarRepresentante;
          
              constructor(
                public modal: NgbActiveModal,
                //llamamos al servicio
                public RepresentanteProveedorService: RepresentanteProveedorService,
              ){
            
              }
            
              ngOnInit(): void {
                this.name = this.REPRESENTANTE_PROVEEDOR_SELECTED.name,
                this.celular = this.REPRESENTANTE_PROVEEDOR_SELECTED.celular,
                this.state = this.REPRESENTANTE_PROVEEDOR_SELECTED.state,
                this.correo = this.REPRESENTANTE_PROVEEDOR_SELECTED.email
              }
          
              store(){
      
                if(!this.name){
                  this.sweet.formulario_invalido("Validacion","el nombre del representante es requerido");
                  return false;
                }

                if(this.celular && String(this.celular).replace(/\D/g, '').length !== 9){
                  this.sweet.formulario_invalido("Validacion","el celular debe de tener 9 digitos");
                  return false;
                }
            
                const data = {
                  'name': this.name,
                  'celular':this.celular,
                  'email':this.correo,
                  'state':this.state
                };
            
                this.RepresentanteProveedorService.updateRepresentanteProveedor(this.REPRESENTANTE_PROVEEDOR_SELECTED.id,data).subscribe({
                  next: (resp: any) => {
                    // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
                    if(resp.message == 409){
                      this.sweetRestaurarRepresentante.confirmar_restauracion('Atencion', resp.message_text);
                      this.sweetRestaurarRepresentante.getRestauracionObservable().subscribe((confirmed:boolean) => {
                        if (confirmed) {
                          this.restaurar(resp.representante_proveedor);
                        }
                      })
                    } else if (resp.message == 403) {
                      this.sweet.alerta('Ups', resp.message_text);
                    } else {
                      this.RepresentanteProveedorE.emit({representante:resp.representante_proveedor, isRestored: false});
                      this.modal.close();
                      this.sweet.success('¡Éxito!', 'el representante se actualizo correctamente');
                    }
                  },
        
                  error: (error) => {
                    // Lógica cuando ocurre un error
                    this.sweet.error(error.status,error.error.message);
                    console.log(error)
                  },
                });
              }
        
              restaurar(cat:any){
                this.RepresentanteProveedorService.restaurarRepresentanteProveedor(cat).subscribe({
                  next: (resp: any) => {
                    if (resp.message === 403) {
                      this.sweet.error('Error', resp.message_text);
                    } else {
                      this.RepresentanteProveedorE.emit({representante:resp.representante_proveedor_restaurado, isRestored: true});
                      this.modal.close();
                      this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
                    }
                  },
                  error: (error) => {
                    this.sweet.error(error.status);
                  }
                })
              }
}
