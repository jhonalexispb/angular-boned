import { Component, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRolesComponent } from '../create-roles/create-roles.component';
import { RolesService } from '../service/roles.service';
import { EditRolesComponent } from '../edit-roles/edit-roles.component';
import { SweetalertService } from '../service/sweetalert.service';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {

  search:string = '';
  ROLES:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    public modalService: NgbModal,
    public rolesService: RolesService,
    private cdr: ChangeDetectorRef
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.listRoles();
  }

  listRoles(page = 1){
    this.rolesService.listRoles(page,this.search).subscribe((resp: any) => {
      if ($.fn.dataTable.isDataTable('#table-roles')) {
        $('#table-roles').DataTable().clear().destroy();  // Eliminar la instancia de DataTables
      }
      this.ROLES = resp.roles;
      this.totalPages = resp.total;
      this.currentPage = page;
      this.cdr.detectChanges();
      this.iniciarDatatable();
    })
  }

  loadPage($event:any){
    this.listRoles($event);
  }

  ngOnDestroy(): void {
    // Asegurarse de destruir el DataTable para evitar fugas de memoria
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

  iniciarDatatable(){
    $(document).ready(function () {

      $('#table-roles').DataTable({
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
        columnDefs: [
          {
            targets: -1, // Índice de la columna de los botones (última columna)
            responsivePriority: 1 // Siempre visible en dispositivos pequeños
          }
        ]
      });
    });
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

    /* const modalRef = this.modalService.open(DeleteRolesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.ROLE_SELECTED = ROL;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.RoleD.subscribe((role:any)=>{
      let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
      if(INDEX != -1){
        this.ROLES.splice(INDEX,1)
      }
    }) */



    this.sweet.confirmar_borrado('¿Estás seguro?', '¿Deseas eliminar este rol?').then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.rolesService.deleteRole(ROL.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              // El rol fue eliminado correctamente, actualizamos la lista
              //creamos un nuevo array sin el elemento eliminado
              this.ROLES = this.ROLES.filter((role:any) => role.id !== ROL.id); // Eliminamos el rol de la lista
              /* 
              Modificamos el array elliminando el elemento
              let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
              if(INDEX != -1){
                this.ROLES.splice(INDEX,1)
              } */
              
              //this.toast.success('Éxito', 'El rol se eliminó correctamente');
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
