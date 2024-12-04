import { SweetalertService } from './../service/sweetalert.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent {

  @Output() RoleC:EventEmitter<any> = new EventEmitter();
  name:string = '';

  SIDEBAR:any = SIDEBAR;
  sweet:any = new SweetalertService

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public roleService: RolesService,
    public toast: ToastrService,
  ){

  }

  ngOnInit(): void {

  }

  addPermission(permiso:string){
    let INDEX = this.permisions.findIndex((perm:string) => perm == permiso);
    if(INDEX != -1){
      this.permisions.splice(INDEX,1);
    } else {
      this.permisions.push(permiso);
    }
    console.log(this.permisions)
  }

  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","El nombre es requerido");
      return false;
    }

    if(this.permisions.length == 0){
      this.sweet.formulario_invalido("Validacion","Necesitas seleccionar un permiso por lo menos");
      return false;
    }

    let data = {
      name: this.name,
      permissions: this.permisions,
    }

    this.roleService.registerRole(data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 403) {
          this.sweet.alerta('Error', resp.message_text);
        } else {
          this.RoleC.emit(resp.role);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'El rol se registró correctamente');
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
