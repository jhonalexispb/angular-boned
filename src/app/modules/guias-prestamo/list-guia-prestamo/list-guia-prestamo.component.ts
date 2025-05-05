import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { GuiaPrestamoService } from '../service/guia-prestamo.service';

@Component({
  selector: 'app-list-guia-prestamo',
  templateUrl: './list-guia-prestamo.component.html',
  styleUrls: ['./list-guia-prestamo.component.scss']
})
export class ListGuiaPrestamoComponent {
  search:string = '';
  GP_LIST:any = [];
  sweet:any = new SweetalertService
  totalPages:number = 0; 
  currentPage:number = 1;

  activeDropdownIndex: number | null = null; // Índice del dropdown activo

  constructor(
    public modalService: NgbModal,
    public gpService: GuiaPrestamoService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    localStorage.removeItem('guia_prestamo_id');
    this.listGuiaPrestamo();
  }

  listGuiaPrestamo(page = 1){
    this.gpService.listGuiaPrestamo(page,this.search).subscribe((resp: any) => {
      this.GP_LIST = resp.guias_prestamo;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listGuiaPrestamo(page);
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }







  /* editOrderCompra(R:any){
    this.router.navigate([`/compras/edit/edit_compra/${R.id}`]);
  }

  deleteOrdenCompra(R:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la orden de compra: ${R.codigo} ${R.proveedor}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.gpService.deleteOrdenCompra(GuiaPrestamoService.id).subscribe({
          next: (resp: any) => {
            this.GP_LIST = this.GP_LIST.filter((sucurs:any) => sucurs.id !== R.id); // Eliminamos el rol de la lista
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
    const modalRef = this.modalService.open(ModalMercaderiaIngresadaComponent,{centered:true, size: 'xl'})
    modalRef.componentInstance.ORDER_COMPRA = R;
    modalRef.componentInstance.DETALLADO = true;
    modalRef.componentInstance.MERCADERIA_DIRECTA = R.mercaderia;
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  confirmarRecepcion(R:any){
    this.sweet.confirmar('¿Estás seguro?', `¿Deseas recepcionar la orden de compra: ${R.codigo} de ${R.proveedor}?`,'/assets/animations/general/ojitos.json','Si',true,'Cancelar').then((result:any) => {
      if (result.isConfirmed) {
        this.gpService.recepcionar_orden_compra(GuiaPrestamoService.id,{ state: 1 }).subscribe({
          next: (resp: any) => {
            let index = this.GP_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
            if (index !== -1) {
              this.GP_LIST[index] = resp.order_compra;
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
        this.gpService.recepcionar_orden_compra(GuiaPrestamoService.id,{ state: 0 }).subscribe({
          next: (resp: any) => {
            let index = this.GP_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
            if (index !== -1) {
              this.GP_LIST[index] = resp.order_compra;
            }

            this.sweet.success('Recepcion cancelada', resp.message);
          },
        })
      }
    });
  } */
}
