import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRucComponent } from '../../clientes/ruc/create-ruc/create-ruc.component';
import { EditRucComponent } from '../../clientes/ruc/edit-ruc/edit-ruc.component';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { VentasService } from '../service/ventas.service';
import { Router } from '@angular/router';
import { MercaderiaOrdenVentaComponent } from '../mercaderia-orden-venta/mercaderia-orden-venta.component';
import { VentaProcesoService } from '../service/venta_proceso_detalle.service';
import { URL_SERVICIO } from 'src/app/config/config';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrls: ['./list-ventas.component.scss']
})
export class ListVentasComponent {
   search:string = '';
    OV_LIST:any = [];
    sweet:any = new SweetalertService
    totalPages:number = 0; 
    currentPage:number = 1;
    isConsultando:boolean = false
  
    activeDropdownIndex: number | null = null; // Índice del dropdown activo
  
    constructor(
      public modalService: NgbModal,
      public orden_venta_service: VentasService,
      private router: Router,
      public venta_proceso_service: VentaProcesoService,
    ){
  
    }
  
    ngOnInit(): void {
      localStorage.removeItem('orden_venta_id');
      this.venta_proceso_service.setVentaParcial({
        clienteSeleccionado: null,
        comprobanteSeleccionado: null,
        zona_reparto: null,
        transporte: null,
        direccionEntrega: null,
        direccionesEntrega: [],
        modo_entrega: null,
        latitud: null,
        longitud: null,
        coordenadas: null,
        imagenReferencia: null,
        formaPago: null,
        opcionesPago: [],
        comentario: ''
      });
      this.listGuiaPrestamo();
    }
  
    listGuiaPrestamo(page = 1){
      this.orden_venta_service.listOrdenVenta(page,this.search).subscribe((resp: any) => {
        this.OV_LIST = resp.ordenes_venta;
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

    consultar_guia_prestamo_pendiente(){
      /* this.isConsultando = true;
      this.orden_venta_service.verificarGuiaPrestamo().subscribe({
        next: (resp: any) => {
          if(resp.tiene_guia_prestamo_pendiente){
            this.sweet.confirmar('Guia de prestamo pendiente',resp.mensaje,'/assets/animations/general/ojitos.json','Si',true,'No').then((result:any) => {
              this.isConsultando = false;
              if (result.isConfirmed) {
                this.router.navigate(['/ventas/register'], { queryParams: { make_with_guia_prestamo: true } });
              }else{
                this.router.navigate(['/ventas/register']);
              }
            });
          }else{
            this.isConsultando = false; */
            this.router.navigate(['/ventas/register']);
          /* }
        },
      }) */
    }
  
    aprobar_orden_venta(R:any){
      let mensaje = `¿Deseas aprobar la orden de venta: <span class="text-success">${R.codigo}</span>`;
  
      const cliente = R.cliente;
      if (cliente && (cliente.ruc || cliente.razon_social || cliente.nombre_comercial)) {
        const ruc = cliente.ruc ? ` <span class="text-success">${cliente.ruc}</span>` : '';
        const razon = cliente.razon_social ? ` <span class="text-success">${cliente.razon_social}</span>` : '';
        const nombre = cliente.nombre_comercial ? ` <span class="text-warning">${cliente.nombre_comercial}</span>` : '';
        mensaje += ` para ${ruc} ${razon} ${nombre}`;
      }

      mensaje += '?';

      this.sweet.confirmar(
        '¿Estás seguro?',
        mensaje,
        '/assets/animations/general/ojitos.json',
        'Sí',
        true,
        'Cancelar'
      ).then((result: any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.cambiar_estado_orden_venta(R.id,{ state: 1 }).subscribe({
            next: (resp: any) => {
              let index = this.OV_LIST.findIndex((ov: any) => ov.id === R.id);
              if (index !== -1) {
                this.OV_LIST[index] = resp.order_venta;
              }
              this.sweet.success('Actualizado', resp.message);
            },
          })
        }
      });
    }

    desaprobar_orden_venta(R:any){
      let mensaje = `¿Deseas desaprobar la orden de venta: <span class="text-success">${R.codigo}</span>`;
  
      const cliente = R.cliente;
      if (cliente && (cliente.ruc || cliente.razon_social || cliente.nombre_comercial)) {
        const ruc = cliente.ruc ? ` <span class="text-success">${cliente.ruc}</span>` : '';
        const razon = cliente.razon_social ? ` <span class="text-success">${cliente.razon_social}</span>` : '';
        const nombre = cliente.nombre_comercial ? ` <span class="text-warning">${cliente.nombre_comercial}</span>` : '';
        mensaje += ` para ${ruc} ${razon} ${nombre}`;
      }

      mensaje += '?';

      this.sweet.confirmar(
        '¿Estás seguro?',
        mensaje,
        '/assets/animations/general/ojitos.json',
        'Sí, desaprobar',
        true,
        'Cancelar'
      ).then((result: any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.cambiar_estado_orden_venta(R.id,{ state: 0 }).subscribe({
            next: (resp: any) => {
              let index = this.OV_LIST.findIndex((ov: any) => ov.id === R.id);
              if (index !== -1) {
                this.OV_LIST[index] = resp.order_venta;
              }
              this.sweet.success('Actualizado', resp.message);
            },
          })
        }
      });
    }

    deleteOrdenVenta(R:any){
      let mensaje = `¿Deseas eliminar la orden de venta: <span class="text-success">${R.codigo}</span>`;
  
      const cliente = R.cliente;
      if (cliente && (cliente.ruc || cliente.razon_social || cliente.nombre_comercial)) {
        const ruc = cliente.ruc ? ` <span class="text-success">${cliente.ruc}</span>` : '';
        const razon = cliente.razon_social ? ` <span class="text-success">${cliente.razon_social}</span>` : '';
        const nombre = cliente.nombre_comercial ? ` <span class="text-warning">${cliente.nombre_comercial}</span>` : '';
        mensaje += ` para ${ruc} ${razon} ${nombre}`;
      }

      mensaje += '?';
      this.sweet.confirmar_borrado('¿Estás seguro?', mensaje).then((result:any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.deleteOrdenVenta(R.id).subscribe({
            next: (resp: any) => {
              this.OV_LIST = this.OV_LIST.filter((s:any) => s.id !== R.id)
              this.sweet.success('Eliminado', resp.message,'/assets/animations/general/borrado_exitoso.json');
            },
          })
        }
      });
    }

    orden_venta_pdf(id:any){
      window.open(URL_SERVICIO+"/orden_venta/pdf/"+id,"_blank")
    }
  
    /* confirmarCancelarEntrega(R:any){
      this.sweet.confirmar('¿Estás seguro?', `¿Deseas cancelar la entrega de la guia de prestamo: ${R.codigo}?`,'/assets/animations/general/ojitos.json','Si, cancelar',true,'No').then((result:any) => {
        if (result.isConfirmed) {
          this.orden_venta_service.actualizarEstadoGuiaPrestamo(R.id,{ state: 1 }).subscribe({
            next: (resp: any) => {
              let index = this.OV_LIST.findIndex((sucurs: any) => sucurs.id === R.id);
              if (index !== -1) {
                this.OV_LIST[index] = resp.guia_prestamo_actualizada;
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
              this.OV_LIST = this.OV_LIST.filter((s:any) => s.id !== R.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', resp.message,'/assets/animations/general/borrado_exitoso.json');
            },
          })
        }
      });
    }*/
  
}
