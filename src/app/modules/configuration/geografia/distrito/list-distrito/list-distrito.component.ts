import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceDistritoService } from '../service/service-distrito.service';
import { EditDistritoComponent } from '../edit-distrito/edit-distrito.component';
import { CreateDistritoComponent } from '../create-distrito/create-distrito.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-distrito',
  templateUrl: './list-distrito.component.html',
  styleUrls: ['./list-distrito.component.scss']
})
export class ListDistritoComponent {
  search:string = '';
        DISTRITOS:any = [];
        PROVINCIAS:any[] = [];
        isLoading:boolean;
        sweet:any = new SweetalertService
      
      
        totalPages:number = 0; 
        currentPage:number = 1;

        page = 1;
        selectPage(page: number) {
          if(page <= this.page && page > 0){
            this.page = page || 1;

            this.currentPage = this.page;
            this.loadPage(this.page);
          }
        }
      
        formatInput(input: HTMLInputElement) {
          input.value = input.value.replace(FILTER_PAG_REGEX, '');
        }
        
      
        constructor(
          public modalService: NgbModal,
          public distritoService: ServiceDistritoService,
        ){
      
        }
      
        ngOnInit(): void {
          this.listDistrito();
        }
      
        listDistrito(page = 1){
          this.isLoading = true
          this.distritoService.listDistrito(page,this.search).subscribe((resp: any) => {
            this.DISTRITOS = resp.distrito;
            this.totalPages = resp.total;
            this.PROVINCIAS = resp.provincias;
            this.currentPage = page;
            this.isLoading = false
          })
        }
      
        loadPage($event:any){
          this.listDistrito($event);
        }
      
        editDistrito(PROV:any){
          const modalRef = this.modalService.open(EditDistritoComponent,{centered:true, size: 'md'})
          modalRef.componentInstance.DISTRITO_SELECTED = PROV;
          modalRef.componentInstance.PROVINCIAS = this.PROVINCIAS;
          modalRef.componentInstance.DistritoE.subscribe((prov:any)=>{
            const { distrito, isRestored } = prov; 
            if (isRestored) {
              this.DISTRITOS.unshift(distrito);
            } else {
              let INDEX = this.DISTRITOS.findIndex((b:any) => b.id == PROV.id);
              if(INDEX != -1){
                this.DISTRITOS[INDEX] = distrito
              }
            }
          })
        }
      
        createDistrito(){
          const modalRef = this.modalService.open(CreateDistritoComponent,{centered:true, size: 'md'})
          modalRef.componentInstance.PROVINCIAS = this.PROVINCIAS
          modalRef.componentInstance.DistritoC.subscribe((prov:any)=>{
            this.DISTRITOS.unshift(prov); //integra el nuevo valor al inicio de la tabla
          })
        }
      
        deleteDistrito(PROVINCIA:any){
          this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el distrito: ${PROVINCIA.name}?`).then((result:any) => {
            if (result.isConfirmed) {
              // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
              this.distritoService.deleteDistrito(PROVINCIA.id).subscribe({
                next: (resp: any) => {
                  if (resp.message === 403) {
                    this.sweet.error('Error', resp.message_text);
                  } else {
                    this.DISTRITOS = this.DISTRITOS.filter((b:any) => b.id !== PROVINCIA.id); // Eliminamos el rol de la lista
                    this.sweet.success('Eliminado', `el distrito ${PROVINCIA.name} ha sido eliminada correctamente`,'/assets/animations/general/borrado_exitoso.json');
                  }
                },
                error: (error) => {
                  this.sweet.error(error.status);
                }
              })
            }
          });
        }
}
