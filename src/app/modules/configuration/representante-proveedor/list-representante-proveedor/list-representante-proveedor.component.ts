import { EditRepresentanteProveedorComponent } from './../edit-representante-proveedor/edit-representante-proveedor.component';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { RepresentanteProveedorService } from '../service/representante-proveedor-service.service';
import { CreateRepresentanteProveedorComponent } from '../create-representante-proveedor/create-representante-proveedor.component';
import { ComunicationPersonComponent } from 'src/app/components/comunication-person/comunication-person.component';

@Component({
  selector: 'app-list-representante-proveedor',
  templateUrl: './list-representante-proveedor.component.html',
  styleUrls: ['./list-representante-proveedor.component.scss']
})
export class ListRepresentanteProveedorComponent {
  search:string = '';
  REPRESENTANTES:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  
  constructor(
    public modalService: NgbModal,
    public representanteProveedorService: RepresentanteProveedorService,
  ){

  }

  ngOnInit(): void {
    this.listRepresentanteProveedor();
  }

  listRepresentanteProveedor(page = 1){
    this.representanteProveedorService.listRepresentanteProveedor(page,this.search).subscribe((resp: any) => {
      this.REPRESENTANTES = resp.representate_proveedor;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page:number){
    this.listRepresentanteProveedor(page);
  }

  createRepresentanteProveedor(){
    const modalRef = this.modalService.open(CreateRepresentanteProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.RepresentanteProveedorC.subscribe((r:any)=>{
      this.REPRESENTANTES.unshift(r); //integra el nuevo valor al inicio de la tabla
    })
  }

  editRepresentanteProveedor(REP:any){
    const modalRef = this.modalService.open(EditRepresentanteProveedorComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.REPRESENTANTE_PROVEEDOR_SELECTED = REP;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.RepresentanteProveedorE.subscribe((rep:any)=>{
      const { representante, isRestored } = rep; 
      if (isRestored) {
        this.REPRESENTANTES.unshift(representante);
      } else {
        let INDEX = this.REPRESENTANTES.findIndex((b:any) => b.id == REP.id);
        if(INDEX != -1){
          this.REPRESENTANTES[INDEX] = representante
        }
      }
    })
  }

  deleteRepresentanteProveedor(REP:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar al representante: ${REP.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.representanteProveedorService.deleteRepresentanteProveedor(REP.id).subscribe({
          next: (resp: any) => {
            this.REPRESENTANTES = this.REPRESENTANTES.filter((sucurs:any) => sucurs.id !== REP.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'el representante ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          }
        })
      }
    });
  }

  comunicationRepresentanteProveedor(DATOS_REP:any){
    const modalRef = this.modalService.open(ComunicationPersonComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.NUMBER_REPRESENTANTE_SELECTED = {
      phone: DATOS_REP[0],  // Celular
      persona: DATOS_REP[1]    // Nombre
    };
  }
}
