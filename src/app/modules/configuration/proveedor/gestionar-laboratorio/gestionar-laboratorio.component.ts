import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { CreateLaboratoriosComponent } from '../../atributtes-products/laboratorios/create-laboratorios/create-laboratorios.component';
import { ServiceProveedorService } from '../service/service-proveedor.service';
import { CreateProveedorLaboratorioComponent } from '../create-proveedor-laboratorio/create-proveedor-laboratorio.component';
import { EditProveedorLaboratorioComponent } from '../edit-proveedor-laboratorio/edit-proveedor-laboratorio.component';

@Component({
  selector: 'app-gestionar-laboratorio',
  templateUrl: './gestionar-laboratorio.component.html',
  styleUrls: ['./gestionar-laboratorio.component.scss']
})
export class GestionarLaboratorioComponent {
  @Output() LIST_LABORATORIOS_ACTUALIZADO:EventEmitter<any> = new EventEmitter();
  @Input() PROVEEDOR_ID: any = '';
  LABORATORIOS_LIST:any[] = [];
  LABORATORIOS_PROVEEDOR_LIST:any[] = [];
  name:string = 'Esperando nombre'
  laboratorio_selected:any = null

  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public proveedorService: ServiceProveedorService,
    public modalService: NgbModal,
  ){

  }

  ngOnInit(): void {
    this.loading = true
    this.proveedorService.obtenerLaboratorios(this.PROVEEDOR_ID).subscribe((data: any) => {
      this.LABORATORIOS_LIST = data.laboratorios;
      this.LABORATORIOS_PROVEEDOR_LIST = data.laboratorios_proveedor
      this.name = data.proveedor
      this.loading = false;
    });
  }

  crearLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.LaboratorioC.subscribe((prov:any)=>{
      this.LABORATORIOS_LIST = [prov, ...this.LABORATORIOS_LIST];
      this.laboratorio_selected = [prov.id, ...this.laboratorio_selected];
    })
  }

  deleteLaboratorioOfProveedor(LAB:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar al laboratorio ${LAB.name} del provedor ${this.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminarRelacionLaboratorioProveedor(LAB.id).subscribe({
          next: (resp: any) => {
            this.LABORATORIOS_PROVEEDOR_LIST = this.LABORATORIOS_PROVEEDOR_LIST.filter((sucurs:any) => sucurs.id !== LAB.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'La relacion ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
            this.LIST_LABORATORIOS_ACTUALIZADO.emit(this.LABORATORIOS_PROVEEDOR_LIST)
          },
        })
      }
    });
  }

  editLaboratorioOfProveedor(LAB:any){
    const modalRef = this.modalService.open(EditProveedorLaboratorioComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PROVEEDOR_ID = this.PROVEEDOR_ID
    modalRef.componentInstance.name = this.name
    modalRef.componentInstance.LABORATORIOS_LIST = this.LABORATORIOS_LIST
    modalRef.componentInstance.RELACION_SELECTED = LAB
    modalRef.componentInstance.LaboratorioProveedorE.subscribe((r:any)=>{
      let INDEX = this.LABORATORIOS_PROVEEDOR_LIST.findIndex((b:any) => b.id == LAB.id);
      if(INDEX != -1){
        this.LABORATORIOS_PROVEEDOR_LIST[INDEX] = r
      }
      this.LIST_LABORATORIOS_ACTUALIZADO.emit(this.LABORATORIOS_PROVEEDOR_LIST)
    })
    
  }

  createLaboratorioProveedor(){
    const modalRef = this.modalService.open(CreateProveedorLaboratorioComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PROVEEDOR_ID = this.PROVEEDOR_ID
    modalRef.componentInstance.name = this.name
    modalRef.componentInstance.LABORATORIOS_LIST = this.LABORATORIOS_LIST
    modalRef.componentInstance.LaboratorioProveedorC.subscribe((r:any)=>{
      this.LABORATORIOS_PROVEEDOR_LIST.unshift(r);
      this.LIST_LABORATORIOS_ACTUALIZADO.emit(this.LABORATORIOS_PROVEEDOR_LIST)
    })
  }
}
