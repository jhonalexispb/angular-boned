import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserService } from '../service/users.service';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit{

  search:string = '';
  USERS:any = [];
  sweet:any = new SweetalertService;

  roles:any = [];
  totalPages:number = 0; 
  currentPage:number = 1; 
  isLoading$:any;


  constructor(
    public modalService: NgbModal,
    public userService: UserService,
  ){

  }

  page = 1;
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;

    this.currentPage = this.page;
    this.loadPage(this.page);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  ngOnInit(): void {
    this.listUsers();
    this.configAll();
  }

  

  listUsers(page = 1){
    this.userService.listUsers(page,this.search).subscribe((resp: any) => {
      this.USERS = resp.users;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  configAll(){
    this.userService.configAll().subscribe((resp: any) => {
      this.roles = resp.roles;
    })
  }

  loadPage($event:any){
    this.listUsers($event);
  }

  createUser(){
    const modalRef = this.modalService.open(CreateUserComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.roles = this.roles
    modalRef.componentInstance.UserC.subscribe((user:any)=>{
      console.log('usuario creado')
      console.log(user)
      this.USERS.unshift(user);
      console.log(this.USERS)
    })
  }

  editUser(USER:any){
    const modalRef = this.modalService.open(EditUserComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.roles = this.roles
    modalRef.componentInstance.USER_SELECTED = USER;
    modalRef.componentInstance.UserE.subscribe((user:any)=>{
      let INDEX = this.USERS.findIndex((user:any) => user.id == USER.id);
      if(INDEX != -1){
        this.USERS[INDEX] = user
      }
    })
  }

  deleteUser(USER:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar al usuario: ${USER.full_name}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(USER.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.USERS = this.USERS.filter((user:any) => user.id !== USER.id);
              this.sweet.success('Eliminado', 'El usuario ha sido eliminado correctamente');
            }
          },
          error: (error) => {
            this.sweet.error(error.status);
          },
        })
      }
    });
  }
}

