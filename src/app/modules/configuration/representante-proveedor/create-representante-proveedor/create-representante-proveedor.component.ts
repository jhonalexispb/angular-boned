import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { RepresentanteProveedorService } from '../service/representante-proveedor-service.service';

@Component({
  selector: 'app-create-representante-proveedor',
  templateUrl: './create-representante-proveedor.component.html',
  styleUrls: ['./create-representante-proveedor.component.scss']
})
export class CreateRepresentanteProveedorComponent {
  @Output() RepresentanteProveedorC:EventEmitter<any> = new EventEmitter();
  name:string = '';
  celular:string = '';
  telefono:string = '';
  correo:string = '';

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public RepresentanteProveedorService: RepresentanteProveedorService,
  ){

  }

  ngOnInit(): void {
    
  }

  store(){

    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del representante es requerido");
      return false;
    }

    if(!this.correo){
      this.sweet.formulario_invalido("Validacion","el representante debe de tener un correo");
      return false;
    }

    if(this.celular && String(this.celular).replace(/\D/g, '').length !== 9){
      this.sweet.formulario_invalido("Validacion","el celular debe de tener 9 digitos");
      return false;
    }

    const data = {
      'name': this.name,
      'celular':this.celular,
      'telefono':this.telefono,
      'email':this.correo,
    };

    this.RepresentanteProveedorService.registerRepresentanteProveedor(data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.representante_proveedor);
            }
          })
        } else {
          this.RepresentanteProveedorC.emit(resp.representante_proveedor);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el representante se creo correctamente');
        }
      },
    });
  }

  restaurar(cat:any){
    this.RepresentanteProveedorService.restaurarRepresentanteProveedor(cat).subscribe({
      next: (resp: any) => {
        this.RepresentanteProveedorC.emit(resp.representante_proveedor_restaurado);
        this.modal.close();
        this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      }
    })
  }
}
