import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProveedorService } from '../service/service-proveedor.service';

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.scss']
})
export class EditProveedorComponent {
  @Output() ProveedorE:EventEmitter<any> = new EventEmitter();
  @Input() PROVEEDOR_SELECTED:any = [];
  DISTRITOS:any = []
  REPRESENTANTES:any = []
  name:string = '';
  razonSocial:string = '';
  address:string = '';
  correo:string = '';
  state:string;
  distrito:null;
  representate:null;

  sweet:any = new SweetalertService

  loading: boolean = false;

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public ProveedorService: ServiceProveedorService,
  ){

  }

  ngOnInit(): void {
    this.name = this.PROVEEDOR_SELECTED.name,
    this.razonSocial = this.PROVEEDOR_SELECTED.razonSocial,
    this.address = this.PROVEEDOR_SELECTED.address,
    this.correo = this.PROVEEDOR_SELECTED.email,
    this.state = this.PROVEEDOR_SELECTED.state,
    this.distrito = this.PROVEEDOR_SELECTED.iddistrito,
    this.representate = this.PROVEEDOR_SELECTED.idrepresentante,
    this.ProveedorService.obtenerRecursos().subscribe((data: any) => {
      this.DISTRITOS = data.distritos;
      this.REPRESENTANTES = data.representantes;
    });
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
      'state':this.state
    };

    this.ProveedorService.updateProveedor(this.PROVEEDOR_SELECTED.id, data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.proveedor);
            }
          })
        } else {
          this.ProveedorE.emit({proveedor:resp.proveedor, isRestored: false});
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el proveedor se actualizo correctamente');
        }
      },
    });
  }

  restaurar(cat:any){
    this.ProveedorService.restaurarProveedor(cat).subscribe({
      next: (resp: any) => {
          this.ProveedorE.emit({proveedor:resp.proveedor_restaurado, isRestored: true});
          this.modal.close();
          this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      }
    })
  }
}
