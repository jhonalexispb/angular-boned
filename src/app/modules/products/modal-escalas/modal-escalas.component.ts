import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';
import { CreateEscalasComponent } from '../create-escalas/create-escalas.component';
import { AtributteProductsService } from '../service/atributte-products.service';
import { EditEscalasComponent } from '../edit-escalas/edit-escalas.component';

@Component({
  selector: 'app-modal-escalas',
  templateUrl: './modal-escalas.component.html',
  styleUrls: ['./modal-escalas.component.scss']
})
export class ModalEscalasComponent {
  @Input() PRODUCT_ID:any = [];
  ESCALAS_LIST:any = [];
  escalas_activas:any;
  escalas_inactivas:any;
  user:any = ''
  sweet:any = new SweetalertService
  activeDropdownIndex: number | null = null;

  constructor(
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
    public productAtributtesService: AtributteProductsService,
    public modalService: NgbModal,
  ){
    
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName() 
    this.productAtributtesService.listEscalas(this.PRODUCT_ID.id).subscribe({
      next: (resp: any) => {
        this.ESCALAS_LIST = resp.escalas
        this.escalas_activas = resp.escalas_activas
        this.escalas_inactivas = resp.escalas_inactivas
      },
    })
  }

  createEscala(){
    const modalRef = this.modalService.open(CreateEscalasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PRODUCT_ID = this.PRODUCT_ID
    modalRef.componentInstance.EscalaC.subscribe((r:any)=>{
      this.ESCALAS_LIST.unshift(r.escala); //integra el nuevo valor al inicio de la tabla
      this.escalas_activas = r.escalas_activas;
      this.escalas_inactivas = r.escalas_inactivas;
    })
  }

  editEscala(e:any){
    const modalRef = this.modalService.open(EditEscalasComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ESCALA_ID_SELECTED = e
    modalRef.componentInstance.PRODUCT_SELECTED = this.PRODUCT_ID
    modalRef.componentInstance.EscalaE.subscribe((r:any)=>{
      this.ESCALAS_LIST = this.ESCALAS_LIST.filter((esc:any) => esc.id !== e.id);
      this.ESCALAS_LIST.unshift(r.escala); //integra el nuevo valor al inicio de la tabla
      this.escalas_activas = r.escalas_activas;
      this.escalas_inactivas = r.escalas_inactivas;
    })
  }

  deleteEscala(e:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar escala de ${e.cantidad} a S/ ${e.precio}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.productAtributtesService.deleteEscala(this.PRODUCT_ID.id,e.id).subscribe({
          next: (resp: any) => {
            this.ESCALAS_LIST = this.ESCALAS_LIST.filter((esc:any) => esc.id !== e.id); // Eliminamos el rol de la lista
            this.escalas_activas = resp.escalas_activas;
            this.escalas_inactivas = resp.escalas_inactivas;
            this.sweet.success('Eliminado', 'La escala ha sido eliminada correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }

  stateEscalaDesactiveActivate(e: any = null, general: boolean = false) {
    let mensajeConfirmacion: any;
    let iconoAnimacion: any;
    let textoBotonConfirmar: any;
    let data: any = {};
    let mensajeConformidad: any;
  
    // Si se está tratando de una operación general
    if (general) {
      mensajeConfirmacion = e === 1 
        ? `¿Deseas activar todas las escalas para el producto ${this.PRODUCT_ID.laboratorio} ${this.PRODUCT_ID.nombre_completo}?`
        : `¿Deseas desactivar todas las escalas para el producto ${this.PRODUCT_ID.laboratorio} ${this.PRODUCT_ID.nombre_completo}?`;
  
      iconoAnimacion = '/assets/animations/general/alerta.json';
      textoBotonConfirmar = e === 1 ? 'Si, activemoslo' : 'Si, desactivemoslo';
      mensajeConformidad = `Las escalas han sido ${e === 1 ? 'activadas' : 'desactivadas'} correctamente`;
      data = { 'state': e };
    } else {
      // Operación para una escala específica
      if (e == null) {
        return;
      }
      
      mensajeConfirmacion = e.state === 1 
        ? `¿Deseas desactivar la escala de ${e.cantidad} a S/ ${e.precio} para el producto ${this.PRODUCT_ID.laboratorio} ${this.PRODUCT_ID.nombre_completo}?`
        : `¿Deseas activar la escala de ${e.cantidad} a S/ ${e.precio} para el producto ${this.PRODUCT_ID.laboratorio} ${this.PRODUCT_ID.nombre_completo}?`;
  
      iconoAnimacion = '/assets/animations/general/alerta.json';
      textoBotonConfirmar = e.state === 1 ? 'Si, desactivemoslo' : 'Si, activémoslo';
      const estadoNuevo = e.state === 1 ? 0 : 1;
      mensajeConformidad = `La escala ha sido ${estadoNuevo === 1 ? 'activada' : 'desactivada'} correctamente`;
      data = { 'state': estadoNuevo };
    }
  
    // Confirmación de SweetAlert
    this.sweet.confirmar_habilitado_deshabilitado('¿Estás seguro?', mensajeConfirmacion, iconoAnimacion, textoBotonConfirmar).then((result: any) => {
      if (result.isConfirmed) {
        // Llamada al servicio para actualizar el estado de la escala (general o específica)
        this.productAtributtesService.updateState(this.PRODUCT_ID.id, e ? e.id : null, data).subscribe({
          next: (resp: any) => {
            if (general) {
              // Actualización a nivel general (todos)
              this.ESCALAS_LIST = resp.escalas
              this.escalas_activas = resp.escalas_activas;
              this.escalas_inactivas = resp.escalas_inactivas;
              this.sweet.success('Éxito', mensajeConformidad);
            } else {
              // Actualización a nivel específico
              let INDEX = this.ESCALAS_LIST.findIndex((b: any) => b.id == e.id);
              if (INDEX != -1) {
                this.ESCALAS_LIST[INDEX] = resp.escala;
              }
              this.escalas_activas = resp.escalas_activas;
              this.escalas_inactivas = resp.escalas_inactivas;
              this.sweet.success('Éxito', mensajeConformidad);
            }
          }
        });
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
