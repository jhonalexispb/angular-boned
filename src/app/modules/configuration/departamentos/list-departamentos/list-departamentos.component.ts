import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/_fake/services/user-service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateUserComponent } from 'src/app/modules/users/create-user/create-user.component';
import { EditUserComponent } from 'src/app/modules/users/edit-user/edit-user.component';
import { ServiceDepartamentosService } from '../service/service-departamentos.service';
import { CreateDepartamentosComponent } from '../create-departamentos/create-departamentos.component';
import { EditDepartamentosComponent } from '../edit-departamentos/edit-departamentos.component';

@Component({
  selector: 'app-list-departamentos',
  templateUrl: './list-departamentos.component.html',
  styleUrls: ['./list-departamentos.component.scss']
})
export class ListDepartamentosComponent {
  search:string = '';
    DEPARTAMENTOS:any = [];
    sweet:any = new SweetalertService;
  
    totalPages:number = 0; 
    currentPage:number = 1; 
    isLoading$:any;
  
  
    constructor(
      public modalService: NgbModal,
      public departamentoService: ServiceDepartamentosService,
    ){
  
    }
  
    ngOnInit(): void {
      this.listDepartamento();
    }
  
    
  
    listDepartamento(page = 1){
      this.departamentoService.listDepartamentos(page,this.search).subscribe((resp: any) => {
        this.DEPARTAMENTOS = resp.departamento;
        this.totalPages = resp.total;
        this.currentPage = page;
      })
    }
  
    loadPage($event:any){
      this.listDepartamento($event);
    }
  
    createDepartamento(){
      const modalRef = this.modalService.open(CreateDepartamentosComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.DepartamentoC.subscribe((dep:any)=>{
        this.DEPARTAMENTOS.unshift(dep);
      })
    }
  
    editDepartamento(DEP:any){
      const modalRef = this.modalService.open(EditDepartamentosComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.DEPARTAMENTO_SELECTED = DEP;
      modalRef.componentInstance.DepartamentoE.subscribe((d:any)=>{
        let INDEX = this.DEPARTAMENTOS.findIndex((d:any) => d.id == DEP.id);
        if(INDEX != -1){
          this.DEPARTAMENTOS[INDEX] = d
        }
      })
    }
  
    deleteDepartamento(DEP:any){
      this.sweet.confirmar_borrado('Pregunta', `¿Deseas eliminar el departamento: ${DEP.name}?`).then((result:any) => {
        if (result.isConfirmed) {
          this.departamentoService.deleteDepartamento(DEP.id).subscribe({
            next: (resp: any) => {
              if (resp.message === 403) {
                this.sweet.error('Error', resp.message_text);
              } else {
                this.DEPARTAMENTOS = this.DEPARTAMENTOS.filter((user:any) => user.id !== DEP.id);
                this.sweet.success('Eliminado', 'El departamento ha sido eliminado correctamente');
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
