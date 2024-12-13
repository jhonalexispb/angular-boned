import { Component } from '@angular/core';
import { SweetalertService } from '../service/sweetalert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LugarEntregaService } from '../service/lugar-entrega.service';
import { CreateLugarEntregaComponent } from '../create-lugar-entrega/create-lugar-entrega.component';
import { EditLugarEntregaComponent } from '../edit-lugar-entrega/edit-lugar-entrega.component';

@Component({
  selector: 'app-list-lugar-entrega',
  templateUrl: './list-lugar-entrega.component.html',
  styleUrls: ['./list-lugar-entrega.component.scss']
})
export class ListLugarEntregaComponent {
  search:string = '';
  LUGAR_ENTREGA:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  

  constructor(
    public modalService: NgbModal,
    public lugarEntregaService: LugarEntregaService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.lugarEntregaService.isLoading$;
    this.listLugarEntrega();
  }

  listLugarEntrega(page = 1){
    this.lugarEntregaService.listLugarEntrega(page,this.search).subscribe((resp: any) => {
      this.LUGAR_ENTREGA = resp.lugarEntrega;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listLugarEntrega($event);
  }

  createLugarEntrega(){
    const modalRef = this.modalService.open(CreateLugarEntregaComponent,{centered:true, size: 'md'})
    
    modalRef.componentInstance.LugarEntregaC.subscribe((lugar:any)=>{
      this.LUGAR_ENTREGA.unshift(lugar); //integra el nuevo valor al inicio de la tabla
    })
  }

  editLugarEntrega(LUGAR_ENTREGA:any){
    const modalRef = this.modalService.open(EditLugarEntregaComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.LUGAR_ENTREGA_SELECTED = LUGAR_ENTREGA;
    modalRef.componentInstance.LUGAR_ENTREGA = this.LUGAR_ENTREGA

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.LugarEntregaE.subscribe((lugar:any)=>{
      let INDEX = this.LUGAR_ENTREGA.findIndex((lugar:any) => lugar.id == LUGAR_ENTREGA.id);
      if(INDEX != -1){
        this.LUGAR_ENTREGA[INDEX] = lugar
      }
    })
  }

  deleteLugarEntrega(LUGAR_ENTREGA:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el lugar de entrega: ${LUGAR_ENTREGA.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.lugarEntregaService.deleteLugarEntrega(LUGAR_ENTREGA.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.LUGAR_ENTREGA = this.LUGAR_ENTREGA.filter((ware:any) => ware.id !== LUGAR_ENTREGA.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'el lugar de entrega ha sido eliminado correctamente', 'success');
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
