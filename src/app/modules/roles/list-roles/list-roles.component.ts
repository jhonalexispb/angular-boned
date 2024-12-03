import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRolesComponent } from '../create-roles/create-roles.component';
import { RolesService } from '../service/roles.service';
import { EditRolesComponent } from '../edit-roles/edit-roles.component';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {

  search:string = '';
  ROLES:any = [];
  isLoading$:any;

  totalPages:number = 0; 
  currentPage:number = 1; 

  constructor(
    public modalService: NgbModal,
    public rolesService: RolesService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.listRoles();
  }

  listRoles(page = 1){
    this.rolesService.listRoles(page,this.search).subscribe((resp: any) => {
      console.log(resp)
      this.ROLES = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listRoles($event);
  }

  createRol(){
    const modalRef = this.modalService.open(CreateRolesComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.RoleC.subscribe((role:any)=>{
      this.ROLES.unshift(role); //integra el nuevo valor al inicio de la tabla
    })
  }

  editRole(ROL:any){
    const modalRef = this.modalService.open(EditRolesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.ROLE_SELECTED = ROL;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.RoleE.subscribe((role:any)=>{
      let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
      if(INDEX != -1){
        this.ROLES[INDEX] = role
      }
    })
  }

  deleteRole(ROL:any){
    const modalRef = this.modalService.open(EditRolesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.ROLE_SELECTED = ROL;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.RoleD.subscribe((role:any)=>{
      let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
      if(INDEX != -1){
        this.ROLES.splice(INDEX,1)
      }
    })
  }
}
