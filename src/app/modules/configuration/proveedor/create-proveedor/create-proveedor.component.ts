import { CreateRepresentanteProveedorComponent } from './../../representante-proveedor/create-representante-proveedor/create-representante-proveedor.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProveedorService } from '../service/service-proveedor.service';

@Component({
  selector: 'app-create-proveedor',
  templateUrl: './create-proveedor.component.html',
  styleUrls: ['./create-proveedor.component.scss']
})
export class CreateProveedorComponent{
  @Output() ProveedorC:EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo:any = '';
  DISTRITOS:any = []
  REPRESENTANTES:any = []
  name:string = '';
  razonSocial:string = '';
  address:string = '';
  correo:string = '';
  distrito:null;
  representante:null;
  ruc:string;
  loading:boolean

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    //llamamos al servicio
    public ProveedorService: ServiceProveedorService,
  ){

  }

  ngOnInit(): void {
    this.loading = true
    this.name = this.nombre_externo
    this.ProveedorService.obtenerRecursos().subscribe((data: any) => {
      this.DISTRITOS = data.distritos;
      this.REPRESENTANTES = data.representantes;
      this.loading = false
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
      'idrepresentante':this.representante,
    };

    this.ProveedorService.registerProveedor(data).subscribe({
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
          this.ProveedorC.emit(resp.proveedor);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el proveedor se creo correctamente');
        }
      },
    });
  }

  createRepresentante(){
      const modalRef = this.modalService.open(CreateRepresentanteProveedorComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.RepresentanteProveedorC.subscribe((r:any)=>{
        this.REPRESENTANTES = [r, ...this.REPRESENTANTES];
        this.representante = r.id
      })
    }

  buscarRazonSocial() {
    this.razonSocial = '';
    this.address = '';
    this.ProveedorService.obtenerRazonSocial(this.ruc).subscribe({
      next: (resp: any) => {
        this.sweet.success('¡Bien!',`dale un saludo a ${resp.razonSocial}`);
        this.razonSocial = resp.razonSocial;
        this.address = resp.response.direccion;
      },
    })
  }

  restaurar(cat:any){
    this.ProveedorService.restaurarProveedor(cat).subscribe({
      next: (resp: any) => {
        this.ProveedorC.emit(resp.proveedor_restaurado);
        this.modal.close();
        this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      }
    })
  }
}
