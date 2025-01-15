import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { PrincipiosActivosServiceService } from '../service/principios-activos-service.service';
import { CreatePrincipioActivoComponent } from '../create-principio-activo/create-principio-activo.component';
import { EditPrincipioActivoComponent } from '../edit-principio-activo/edit-principio-activo.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-principio-activo',
  templateUrl: './list-principio-activo.component.html',
  styleUrls: ['./list-principio-activo.component.scss']
})
export class ListPrincipioActivoComponent {
  search:string = '';
    PRINCIPIOS_ACTIVOS:any = [];
    sweet:any = new SweetalertService
  
    totalPages:number = 0; 
    currentPage:number = 1;
    
    page = 1;
    selectPage(page: string) {
      this.page = parseInt(page, 10) || 1;
  
      this.currentPage = this.page;
      this.loadPage(this.page);
    }
  
    formatInput(input: HTMLInputElement) {
      input.value = input.value.replace(FILTER_PAG_REGEX, '');
    }
  
    constructor(
      public modalService: NgbModal,
      public principioActivoService: PrincipiosActivosServiceService,
    ){
  
    }
  
    ngOnInit(): void {
      this.listPrincipioActivo();
    }
  
    listPrincipioActivo(page = 1){
      this.principioActivoService.listPrincipioActivo(page,this.search).subscribe((resp: any) => {
        this.PRINCIPIOS_ACTIVOS = resp.principio_activo;
        this.totalPages = resp.total;
        this.currentPage = page;
      })
    }
  
    loadPage($event:any){
      this.listPrincipioActivo($event);
    }
  
    createPrincipioActivo(){
      const modalRef = this.modalService.open(CreatePrincipioActivoComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.PrincipioActivoC.subscribe((p:any)=>{
        this.PRINCIPIOS_ACTIVOS.unshift(p); //integra el nuevo valor al inicio de la tabla
      })
    }
  
    editPrincipioActivo(PA:any){
      const modalRef = this.modalService.open(EditPrincipioActivoComponent,{centered:true, size: 'md'})
  
      modalRef.componentInstance.PRINCIPIO_ACTIVO_SELECTED = PA;
  
      //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
      modalRef.componentInstance.PrincipioActivoE.subscribe((cat:any)=>{
        const { principioActivo, isRestored } = cat; 
        if (isRestored) {
          this.PRINCIPIOS_ACTIVOS.unshift(principioActivo);
        } else {
          let INDEX = this.PRINCIPIOS_ACTIVOS.findIndex((b:any) => b.id == PA.id);
          if(INDEX != -1){
            this.PRINCIPIOS_ACTIVOS[INDEX] = principioActivo
          }
        }
      })
    }
  
    deletePrincipioActivo(PA:any){
      this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el principio activo: ${PA.name_complete}?`).then((result:any) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
          this.principioActivoService.deletePrincipioActivo(PA.id).subscribe({
            next: (resp: any) => {
              if (resp.message === 403) {
                this.sweet.error('Error', resp.message_text);
              } else {
                this.PRINCIPIOS_ACTIVOS = this.PRINCIPIOS_ACTIVOS.filter((sucurs:any) => sucurs.id !== PA.id); // Eliminamos el rol de la lista
                this.sweet.success('Eliminado', 'el principio activo ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
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
