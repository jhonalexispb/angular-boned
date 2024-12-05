import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../service/sweetalertusers.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListRolesComponent {

  search:string = '';
  USERS:any = [];
  sweet:any = new SweetalertService;

  totalPages:number = 0; 
  currentPage:number = 1; 

  constructor(
    public modalService: NgbModal,
    public userService: UsersService,
  ){

  }

  ngOnInit(): void {
    this.listUsers();
  }

  listUsers(page = 1){
    this.userService.listUsers(page,this.search).subscribe((resp: any) => {
      this.USERS = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listUsers($event);
  }

  createUser(){
    const modalRef = this.modalService.open(CreateUserComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.RoleC.subscribe((role:any)=>{
      this.USERS.unshift(role); //integra el nuevo valor al inicio de la tabla
    })
  }

  editUser(USER:any){
    const modalRef = this.modalService.open(EditUserComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.USER_SELECTED = USER;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.RoleE.subscribe((user:any)=>{
      let INDEX = this.USERS.findIndex((user:any) => user.id == USER.id);
      if(INDEX != -1){
        this.USERS[INDEX] = user
      }
    })
  }

  deleteUser(USER:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', '¿Deseas eliminar este rol?').then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.userService.DeleteUserComponent(USER.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.USERS = this.USERS.filter((role:any) => role.id !== ROL.id);
              this.sweet.success('Eliminado', 'El rol ha sido eliminado correctamente', 'success');
            }
          },
          error: (error) => {
            this.sweet.error(error.status);
          },
          complete: () => {

          }
        })
      }
    });
  }
}

