import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ComunicationRepresentanteProveedorComponent } from '../../representante-proveedor/comunication-representante-proveedor/comunication-representante-proveedor.component';
import { ServiceProveedorService } from '../service/service-proveedor.service';
import { CreateProveedorComponent } from '../create-proveedor/create-proveedor.component';
import { EditProveedorComponent } from '../edit-proveedor/edit-proveedor.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-proveedor',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.scss']
})
export class ListProveedorComponent {
  search:string = '';
  PROVEEDORES:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  
  page = 1;
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.currentPage = this.page;
    this.loadPage(this.page);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  constructor(
    public modalService: NgbModal,
    public proveedorService: ServiceProveedorService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.proveedorService.isLoading$;
    this.listProveedor();
  }

  listProveedor(page = 1){
    this.proveedorService.listProveedor(page,this.search).subscribe((resp: any) => {
      this.PROVEEDORES = resp.proveedor;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listProveedor($event);
  }

  createProveedor(){
    const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ProveedorC.subscribe((r:any)=>{
      this.PROVEEDORES.unshift(r); //integra el nuevo valor al inicio de la tabla
    })
  }

  editProveedor(REP:any){
    const modalRef = this.modalService.open(EditProveedorComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.PROVEEDOR_SELECTED = REP;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.ProveedorE.subscribe((rep:any)=>{
      const { proveedor, isRestored } = rep; 
      if (isRestored) {
        this.PROVEEDORES.unshift(proveedor);
      } else {
        let INDEX = this.PROVEEDORES.findIndex((b:any) => b.id == REP.id);
        if(INDEX != -1){
          this.PROVEEDORES[INDEX] = proveedor
        }
      }
    })
  }

  deleteProveedor(REP:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el proveedor: ${REP.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.proveedorService.deleteProveedor(REP.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.PROVEEDORES = this.PROVEEDORES.filter((sucurs:any) => sucurs.id !== REP.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'el proveedor ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
            }
          },
          error: (error) => {
            this.sweet.error(error.status);
          }
        })
      }
    });
  }

  comunicationRepresentanteProveedor(DATOS_REP:any){
    const modalRef = this.modalService.open(ComunicationRepresentanteProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.NUMBER_REPRESENTANTE_SELECTED = {
      phone: DATOS_REP[0],
      name: DATOS_REP[1]
    };
  }
}
