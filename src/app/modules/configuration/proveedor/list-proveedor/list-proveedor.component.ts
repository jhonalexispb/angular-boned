import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProveedorService } from '../service/service-proveedor.service';
import { CreateProveedorComponent } from '../create-proveedor/create-proveedor.component';
import { EditProveedorComponent } from '../edit-proveedor/edit-proveedor.component';
import { ComunicationProveedorComponent } from '../comunication-proveedor/comunication-proveedor.component';
import { GestionarLaboratorioComponent } from '../gestionar-laboratorio/gestionar-laboratorio.component';

@Component({
  selector: 'app-list-proveedor',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.scss']
})
export class ListProveedorComponent {
  search:string = '';
  PROVEEDORES:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;

  activeDropdownIndex: number | null = null;
  
  page = 1;
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
    this.currentPage = this.page;
    this.loadPage(this.page);
  }

  constructor(
    public modalService: NgbModal,
    public proveedorService: ServiceProveedorService,
  ){

  }

  ngOnInit(): void {
    this.listProveedor();
  }

  listProveedor(page = 1){
    this.proveedorService.listProveedor(page,this.search).subscribe((resp: any) => {
      this.PROVEEDORES = resp.proveedor;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number){
    this.listProveedor(page);
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
              this.PROVEEDORES = this.PROVEEDORES.filter((sucurs:any) => sucurs.id !== REP.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'el proveedor ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }

  comunicationRepresentanteProveedor(DATOS_REP:any){
    const modalRef = this.modalService.open(ComunicationProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.NUMBER_REPRESENTANTE_SELECTED = {
      phone: DATOS_REP[0],
      proveedor: DATOS_REP[1],
      persona: DATOS_REP[2]
    };
  }

  gestionarLaboratorios(proveedorId:any){
    const modalRef = this.modalService.open(GestionarLaboratorioComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PROVEEDOR_ID = proveedorId
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
