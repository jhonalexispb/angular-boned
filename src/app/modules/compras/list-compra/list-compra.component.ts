import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CompraService } from '../service/compra.service';
import { Router } from '@angular/router';
import { MercaderiaOrderCompraComponent } from '../mercaderia-order-compra/mercaderia-order-compra.component';
import { ModalComprobantesComponent } from '../modal-comprobantes/modal-comprobantes.component';
import { ModalMercaderiaIngresadaComponent } from '../modal-mercaderia-ingresada/modal-mercaderia-ingresada.component';

@Component({
  selector: 'app-list-compra',
  templateUrl: './list-compra.component.html',
  styleUrls: ['./list-compra.component.scss']
})
export class ListCompraComponent {
  search:string = '';
  OC_LIST:any = [];
  sweet:any = new SweetalertService
  totalPages:number = 0; 
  currentPage:number = 1;

  activeDropdownIndex: number | null = null; // Índice del dropdown activo

  constructor(
    public modalService: NgbModal,
    public ocService: CompraService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    localStorage.removeItem('compra_edit_selected');
    localStorage.removeItem('compra_edit_detail_selected');
    localStorage.removeItem('eventos_edit_compra_cuotas');
    localStorage.removeItem("comprobante_creado_by_orden_compra");
    localStorage.removeItem("afectacion_igv");
    localStorage.removeItem("orden_compra_cheking");
    this.listOrdenCompra();
  }

  listOrdenCompra(page = 1){
    this.ocService.listOrdenCompra(page,this.search).subscribe((resp: any) => {
      this.OC_LIST = resp.order_compra_list;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listOrdenCompra(page);
  }

  editOrderCompra(R:any){
    this.router.navigate([`/compras/edit/edit_compra/${R.id}`]);
  }

  deleteOrdenCompra(R:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la orden de compra: ${R.codigo} ${R.proveedor}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.ocService.deleteOrdenCompra(R.id).subscribe({
          next: (resp: any) => {
            this.OC_LIST = this.OC_LIST.filter((sucurs:any) => sucurs.id !== R.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', resp.message,'/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }

  verProductosOrderCompra(R:any){
    const modalRef = this.modalService.open(MercaderiaOrderCompraComponent,{centered:true, size: 'lg'})
    modalRef.componentInstance.ORDER_COMPRA = R;
  }

  verComprobantesOrderCompra(R:any){
    const modalRef = this.modalService.open(ModalComprobantesComponent,{centered:true, size: 'lg'})
    modalRef.componentInstance.ORDER_COMPRA = R;
  }

  verProductosIngresadosOrderCompra(R:any){
    const modalRef = this.modalService.open(ModalMercaderiaIngresadaComponent,{centered:true, size: 'lg'})
    modalRef.componentInstance.ORDER_COMPRA = R;
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  confirmarRecepcion(R:any){
    this.sweet.confirmar('¿Estás seguro?', `¿Deseas recepcionar la orden de compra: ${R.codigo} de ${R.proveedor}?`,'/assets/animations/general/ojitos.json','Si',true,'Cancelar').then((result:any) => {
      if (result.isConfirmed) {
        this.ocService.recepcionar_orden_compra(R.id,{ state: 1 }).subscribe({
          next: (resp: any) => {
            let index = this.OC_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
            if (index !== -1) {
              this.OC_LIST[index] = resp.order_compra;
            }

            this.sweet.success('Actualizado', resp.message);
          },
        })
      }
    });
  }

  confirmarCancelarRecepcion(R:any){
    this.sweet.confirmar('¿Estás seguro?', `¿Deseas cancelar la recepción de la orden de compra: ${R.codigo} de ${R.proveedor}?`,'/assets/animations/general/ojitos.json','Si, cancelar',true,'No').then((result:any) => {
      if (result.isConfirmed) {
        this.ocService.recepcionar_orden_compra(R.id,{ state: 0 }).subscribe({
          next: (resp: any) => {
            let index = this.OC_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
            if (index !== -1) {
              this.OC_LIST[index] = resp.order_compra;
            }

            this.sweet.success('Recepcion cancelada', resp.message);
          },
        })
      }
    });
  }

  revisarMercaderia(id:any){
    this.router.navigate([`/compras/check-mercaderia/ckeck/${id}`]);
  }
}
