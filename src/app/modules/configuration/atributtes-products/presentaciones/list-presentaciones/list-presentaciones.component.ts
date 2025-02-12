import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { PresentacionesService } from '../service/presentaciones.service';
import { CreatePresentacionesComponent } from '../create-presentaciones/create-presentaciones.component';
import { EditPresentacionesComponent } from '../edit-presentaciones/edit-presentaciones.component';

@Component({
  selector: 'app-list-presentaciones',
  templateUrl: './list-presentaciones.component.html',
  styleUrls: ['./list-presentaciones.component.scss']
})
export class ListPresentacionesComponent {
  search:string = '';
  PRESENTACIONES:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;

  constructor(
    public modalService: NgbModal,
    public presentacionService: PresentacionesService,
  ){

  }

  ngOnInit(): void {
    this.listPresentaciones();
  }

  listPresentaciones(page = 1){
    this.presentacionService.listPresentaciones(page,this.search).subscribe((resp: any) => {
      this.PRESENTACIONES = resp.presentacion;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listPresentaciones(page);
  }

  createPresentacion(){
    const modalRef = this.modalService.open(CreatePresentacionesComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PresentacionC.subscribe((c:any)=>{
      this.PRESENTACIONES.unshift(c); //integra el nuevo valor al inicio de la tabla
    })
  }

  editPresentacion(C:any){
    const modalRef = this.modalService.open(EditPresentacionesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.PRESENTACION_SELECTED = C;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.PresentacionE.subscribe((c:any)=>{
      const { presentacion, isRestored } = c; 
      if (isRestored) {
        this.PRESENTACIONES.unshift(presentacion);
      } else {
        let INDEX = this.PRESENTACIONES.findIndex((b:any) => b.id == C.id);
        if(INDEX != -1){
          this.PRESENTACIONES[INDEX] = presentacion
        }
      }
    })
  }

  deletePresentacion(C:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la presentacion: ${C.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.presentacionService.deletePresentacion(C.id).subscribe({
          next: (resp: any) => {
            this.PRESENTACIONES = this.PRESENTACIONES.filter((sucurs:any) => sucurs.id !== C.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'La presentacion ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
          }
        })
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
