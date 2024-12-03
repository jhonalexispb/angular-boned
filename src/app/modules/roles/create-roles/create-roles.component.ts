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

  isLoading:any;

  SIDEBAR:any = SIDEBAR;

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
      this.toast.error("Validacion","El nombre es requerido");
      return false;
    }

    if(this.permisions.length == 0){
      this.toast.error("Validacion","Necesitas seleccionar un permiso por lo menos");
      return false;
    }

    let data = {
      name: this.name,
      permissions: this.permisions,
    }

    //usamos el servicio para guardar la data
    this.roleService.registerRole(data).subscribe((resp:any)=>{
      console.log(resp)
      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.toast.success("Exito","El rol se registro correctamente"); 
        this.RoleC.emit(resp.role);
        this.modal.close();
      }
    })
  }
}
