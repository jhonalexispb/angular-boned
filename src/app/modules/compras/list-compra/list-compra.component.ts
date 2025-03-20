import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { CompraService } from '../service/compra.service';
import { Router } from '@angular/router';

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

  deleteRuc(RUC:any){
    /* this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el cliente: ${RUC.ruc} ${RUC.razonSocial}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.ocService.deleteRuc(RUC.id).subscribe({
          next: (resp: any) => {
            this.OC_LIST = this.OC_LIST.filter((sucurs:any) => sucurs.id !== RUC.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El cliente ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    }); */
  }

  // Método que se ejecuta cuando un dropdown es activado o desactivado
  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
