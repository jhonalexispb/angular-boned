import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../service/sweetalertusers.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { UserService } from '../service/users.service';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit, OnDestroy{

  search:string = '';
  USERS:any = [];
  sweet:any = new SweetalertService;

  roles:any = [];
  totalPages:number = 0; 
  currentPage:number = 1; 
  isLoading$:any;

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    public modalService: NgbModal,
    public userService: UserService,
    private cdr: ChangeDetectorRef
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.userService.isLoading$
    this.listUsers();
    this.configAll();
  }

  

  listUsers(page = 1){
    this.userService.listUsers(page,this.search).subscribe((resp: any) => {
      /* if ($.fn.dataTable.isDataTable('#example')) {
        $('#example').DataTable().clear().destroy();  // Eliminar la instancia de DataTables
      } */
      this.USERS = resp.users;
      this.totalPages = resp.total;
      this.currentPage = page;
      this.cdr.detectChanges();
      /* this.iniciarDatatable(); */
    })
  }

  configAll(){
    this.userService.configAll().subscribe((resp: any) => {
      console.log(resp)
      this.roles = resp.roles;
    })
  }

  ngOnDestroy(): void {
    // Asegurarse de destruir el DataTable para evitar fugas de memoria
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

  loadPage($event:any){
    this.listUsers($event);
  }

  iniciarDatatable(){
    $(document).ready(function () {

      $('#example').DataTable({
        paging: false,  // Activar paginación
        searching: false,  // Activar la búsqueda
        ordering: true,  // Activar la ordenación
        info: true,  // Mostrar información sobre la tabla
        lengthChange: true,  // Permitir cambiar el número de elementos por página
        pageLength: 5,  // Número de elementos por página (paginación)
        responsive: true,  // Hacer la tabla responsiva
        language: {  // Personalización del idioma (opcional)
          url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-MX.json' // Usar idioma español
        },
        order: [[0, 'asc']],  // Ordenar por la primera columna (index 0) por defecto
      });
    });
  }

  createUser(){
    const modalRef = this.modalService.open(CreateUserComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.roles = this.roles
    modalRef.componentInstance.UserC.subscribe((role:any)=>{
      this.USERS.unshift(role);
    })
  }

  editUser(USER:any){
    const modalRef = this.modalService.open(EditUserComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.USER_SELECTED = USER;
    modalRef.componentInstance.RoleE.subscribe((user:any)=>{
      let INDEX = this.USERS.findIndex((user:any) => user.id == USER.id);
      if(INDEX != -1){
        this.USERS[INDEX] = user
      }
    })
  }

  deleteUser(USER:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', '¿Deseas eliminar este usuario?').then((result:any) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(USER.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.USERS = this.USERS.filter((user:any) => user.id !== USER.id);
              this.sweet.success('Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
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

