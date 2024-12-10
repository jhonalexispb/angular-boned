import { Component } from '@angular/core';
import { SucursalService } from '../service/sucursal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateSucursalComponent } from '../create-sucursal/create-sucursal.component';
import { EditSucursalComponent } from '../edit-sucursal/edit-sucursal.component';
import { SweetalertService } from '../service/sweetalert.service';

@Component({
  selector: 'app-list-sucursal',
  templateUrl: './list-sucursal.component.html',
  styleUrls: ['./list-sucursal.component.scss']
})
export class ListSucursalComponent {
  search:string = '';
  SUCURSALES:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  

  constructor(
    public modalService: NgbModal,
    public sucursalService: SucursalService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.sucursalService.isLoading$;
    this.listSucursales();
  }

  listSucursales(page = 1){
    this.sucursalService.listSucursales(page,this.search).subscribe((resp: any) => {
      this.SUCURSALES = resp.sucursales;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listSucursales($event);
  }

  createSucursal(){
    const modalRef = this.modalService.open(CreateSucursalComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.SucursalC.subscribe((sucursal:any)=>{
      this.SUCURSALES.unshift(sucursal); //integra el nuevo valor al inicio de la tabla
    })
  }

  editSucursal(SUCURSAL:any){
    const modalRef = this.modalService.open(EditSucursalComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.SucursalE.subscribe((sucursal:any)=>{
      let INDEX = this.SUCURSALES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
      if(INDEX != -1){
        this.SUCURSALES[INDEX] = sucursal
      }
    })
  }

  deleteSucursal(SUCURSAL:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la sucursal: ${SUCURSAL.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.sucursalService.deleteSucursal(SUCURSAL.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.SUCURSALES = this.SUCURSALES.filter((sucurs:any) => sucurs.id !== SUCURSAL.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'La sucursal ha sido eliminada correctamente', 'success');
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
