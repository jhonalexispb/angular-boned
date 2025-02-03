import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ComprobanteService } from '../service/comprobante-service.service';
import { EditComprobanteComponent } from '../edit-comprobante/edit-comprobante.component';
import { CreateComprobanteComponent } from '../create-comprobante/create-comprobante.component';

@Component({
  selector: 'app-list-comprobante',
  templateUrl: './list-comprobante.component.html',
  styleUrls: ['./list-comprobante.component.scss']
})
export class ListComprobanteComponent {
  search:string = '';
  COMPROBANTES:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;
  
  constructor(
    public modalService: NgbModal,
    public comprobanteService: ComprobanteService,
  ){

  }

  ngOnInit(): void {
    this.listComprobante();
  }

  listComprobante(page = 1){
    this.comprobanteService.listComprobante(page,this.search).subscribe((resp: any) => {
      this.COMPROBANTES = resp.comprobante_pago;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page:number){
    this.listComprobante(page);
  }

  editComprobante(COMP:any){
    const modalRef = this.modalService.open(EditComprobanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.COMPROBANTE_SELECTED = COMP;
    modalRef.componentInstance.ComprobanteE.subscribe((c:any)=>{
      let INDEX = this.COMPROBANTES.findIndex((b:any) => b.id == COMP.id);
      if(INDEX != -1){
        this.COMPROBANTES[INDEX] = c
      }
    })
  }

  createComprobante(){
    const modalRef = this.modalService.open(CreateComprobanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ComprobanteC.subscribe((c:any)=>{
      this.COMPROBANTES.unshift(c); //integra el nuevo valor al inicio de la tabla
    })
  }

  deleteComprobante(COMPROBANTE:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el comprobante: ${COMPROBANTE.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.comprobanteService.deleteComprobante(COMPROBANTE.id).subscribe({
          next: (resp: any) => {
            this.COMPROBANTES = this.COMPROBANTES.filter((c:any) => c.id !== COMPROBANTE.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El comprobante ha sido eliminado correctamente');
          }
        })
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
