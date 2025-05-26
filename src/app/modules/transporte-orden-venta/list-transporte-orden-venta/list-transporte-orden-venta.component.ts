import { Component } from '@angular/core';
import { MercaderiaGuiaPrestamoComponent } from '../../guias-prestamo/mercaderia-guia-prestamo/mercaderia-guia-prestamo.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GuiaPrestamoService } from '../../guias-prestamo/service/guia-prestamo.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { TransporteOrdenVentaService } from '../service/transporte-orden-venta.service';
import { CreateTransporteOrdenVentaComponent } from '../create-transporte-orden-venta/create-transporte-orden-venta.component';
import { EditTransporteOrdenVentaComponent } from '../edit-transporte-orden-venta/edit-transporte-orden-venta.component';

@Component({
  selector: 'app-list-transporte-orden-venta',
  templateUrl: './list-transporte-orden-venta.component.html',
  styleUrls: ['./list-transporte-orden-venta.component.scss']
})
export class ListTransporteOrdenVentaComponent {
  search:string = '';
  TRANSPORTES_LIST:any = [];
  sweet:any = new SweetalertService
  totalPages:number = 0; 
  currentPage:number = 1;

  activeDropdownIndex: number | null = null; // Índice del dropdown activo

  constructor(
    public modalService: NgbModal,
    public transporteService: TransporteOrdenVentaService
  ){

  }

  ngOnInit(): void {
    localStorage.removeItem('guia_prestamo_id');
    this.listTransporteOrdenVenta();
  }

  listTransporteOrdenVenta(page = 1){
    this.transporteService.listTransporteOrdenVenta(page,this.search).subscribe((resp: any) => {
      this.TRANSPORTES_LIST = resp.transportes;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listTransporteOrdenVenta(page);
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  createTransporteOrdenVenta(){
    const modalRef = this.modalService.open(CreateTransporteOrdenVentaComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ProveedorC.subscribe((r:any)=>{
      this.TRANSPORTES_LIST.unshift(r);
    })
  }

  editTransporteOrdenVenta(R:any){
    const modalRef = this.modalService.open(EditTransporteOrdenVentaComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.TRANSPORTE_ORDEN_VENTA_SELECTED = R;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.TransporteOrdenVentaE.subscribe((r:any)=>{
        let INDEX = this.TRANSPORTES_LIST.findIndex((b:any) => b.id == R.id);
        if(INDEX != -1){
          this.TRANSPORTES_LIST[INDEX] = r
        }
    })
  }

  deleteTransporteOrdenVenta(R:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el transporte: ${R.ruc} ${R.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.transporteService.delete_transporte_orden_venta(R.id).subscribe({
          next: (resp: any) => {
            this.TRANSPORTES_LIST = this.TRANSPORTES_LIST.filter((s:any) => s.id !== R.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', resp.message,'/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }
}
