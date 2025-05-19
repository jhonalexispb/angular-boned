import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRucComponent } from '../../clientes/ruc/create-ruc/create-ruc.component';
import { EditRucComponent } from '../../clientes/ruc/edit-ruc/edit-ruc.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { VentasService } from '../service/ventas.service';
import { Router } from '@angular/router';
import { MercaderiaOrdenVentaComponent } from '../mercaderia-orden-venta/mercaderia-orden-venta.component';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrls: ['./list-ventas.component.scss']
})
export class ListVentasComponent {
   search:string = '';
    GP_LIST:any = [];
    sweet:any = new SweetalertService
    totalPages:number = 0; 
    currentPage:number = 1;
  
    activeDropdownIndex: number | null = null; // Índice del dropdown activo
  
    constructor(
      public modalService: NgbModal,
      public orden_venta_service: VentasService,
      private router: Router
    ){
  
    }
  
    ngOnInit(): void {
      localStorage.removeItem('orden_venta_id');
      this.listGuiaPrestamo();
    }
  
    listGuiaPrestamo(page = 1){
      this.orden_venta_service.listOrdenVenta(page,this.search).subscribe((resp: any) => {
        this.GP_LIST = resp.ordenes_venta;
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

    verProductosOrdenVenta(R:any){
      const modalRef = this.modalService.open(MercaderiaOrdenVentaComponent,{centered:true, size: 'lg'})
      modalRef.componentInstance.ORDEN_VENTA = R;
    }
  
    /* confirmarEntrega(R:any){
      if(!R.encargado){
        this.sweet.alerta('Uyyy','la guia de prestamo no tiene un encargado asignado')
        return
      }
      this.sweet.confirmar('¿Estás seguro?', `¿Deseas entregar la guia de prestamo ${R.codigo} a ${R.encargado}?`,'/assets/animations/general/ojitos.json','Si',true,'Cancelar').then((result:any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.actualizarEstadoGuiaPrestamo(R.id,{ state: 2 }).subscribe({ //STATE 2 ES ENTREGADO
            next: (resp: any) => {
              let index = this.GP_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
              if (index !== -1) {
                this.GP_LIST[index] = resp.guia_prestamo_actualizada;
              }
  
              this.sweet.success('Actualizado', 'guia de prestamo entregada satisfactoriamente');
            },
          })
        }
      });
    } */
  
    /* confirmarCancelarEntrega(R:any){
      this.sweet.confirmar('¿Estás seguro?', `¿Deseas cancelar la entrega de la guia de prestamo: ${R.codigo}?`,'/assets/animations/general/ojitos.json','Si, cancelar',true,'No').then((result:any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.actualizarEstadoGuiaPrestamo(R.id,{ state: 1 }).subscribe({
            next: (resp: any) => {
              let index = this.GP_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
              if (index !== -1) {
                this.GP_LIST[index] = resp.guia_prestamo_actualizada;
              }
  
              this.sweet.success('Entrega cancelada', 'la entrega de la guia de prestamo fue cancelada satisfacoriamente');
            },
          })
        }
      });
    }
  
    deleteGuiaPrestamo(R:any){
      this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la guia de prestamo: ${R.codigo}?`).then((result:any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.deleteGuiaPrestamo(R.id).subscribe({
            next: (resp: any) => {
              this.GP_LIST = this.GP_LIST.filter((s:any) => s.id !== R.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', resp.message,'/assets/animations/general/borrado_exitoso.json');
            },
          })
        }
      });
    }

  
    vaciarGuiaPrestamo(R:any){
      this.sweet.confirmar('¿Estás seguro?', `¿Deseas quitar todos los productos de la guia de prestamo: ${R.codigo}?`,'/assets/animations/general/ojitos.json','Si, cancelar',true,'No').then((result:any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.vaciarGuiaPrestamo(R.id).subscribe({
            next: (resp: any) => {
              let index = this.GP_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
              if (index !== -1) {
                this.GP_LIST[index] = resp.guia_prestamo_actualizada;
              }
  
              this.sweet.success('Actualizado', 'los productos de la guia de prestamo fueron eliminados satisfactoriamente');
            },
          })
        }
      });
    } */
  
}
