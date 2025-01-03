import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SweetRestaurarProveedor } from '../service/restauracionAlert.service';
import { ServiceProveedorService } from '../service/service-proveedor.service';

@Component({
  selector: 'app-create-proveedor',
  templateUrl: './create-proveedor.component.html',
  styleUrls: ['./create-proveedor.component.scss']
})
export class CreateProveedorComponent {
  @Output() ProveedorC:EventEmitter<any> = new EventEmitter();
  @Input()  DISTRITOS:any = []
  @Input()  REPRESENTANTES:any = []
    name:string = '';
    razonSocial:string = '';
    address:string = '';
    correo:string = '';
    distrito:null;
    representate:null;
  
    sweet:any = new SweetalertService
    sweetRestaurarProveedor:any = new SweetRestaurarProveedor;

    loading: boolean = false;
  
    constructor(
      public modal: NgbActiveModal,
      //llamamos al servicio
      public ProveedorService: ServiceProveedorService,
    ){
  
    }
  
    ngOnInit(): void {
      
    }
  
    store(){
  
      if(!this.name){
        this.sweet.formulario_invalido("Validacion","el nombre del proveedor es requerido");
        return false;
      }

      if(!this.razonSocial){
        this.sweet.formulario_invalido("Validacion","la razon social del proveedor es requerida");
        return false;
      }
  
      const data = {
        'name': this.name,
        'razonSocial': this.razonSocial,
        'email':this.correo,
        'address':this.address,
        'iddistrito':this.distrito,
        'idrepresentante':this.representate,
      };
  
      this.ProveedorService.registerProveedor(data).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if(resp.message == 409){
            this.sweetRestaurarProveedor.confirmar_restauracion('Atencion', resp.message_text);
            this.sweetRestaurarProveedor.getRestauracionObservable().subscribe((confirmed:boolean) => {
              if (confirmed) {
                this.restaurar(resp.proveedor);
              }
            })
          } else if (resp.message == 403) {
            this.sweet.alerta('Ups', resp.message_text);
          } else {
            this.ProveedorC.emit(resp.proveedor);
            this.modal.close();
            this.sweet.success('¡Éxito!', 'el proveedor se creo correctamente');
          }
        },
  
        error: (error) => {
          // Lógica cuando ocurre un error
          this.sweet.error(error.status);
          //console.log(error.status)
        },
      });
    }
  
    restaurar(cat:any){
      this.ProveedorService.restaurarProveedor(cat).subscribe({
        next: (resp: any) => {
          if (resp.message === 403) {
            this.sweet.error('Error', resp.message_text);
          } else {
            this.ProveedorC.emit(resp.proveedor_restaurado);
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
