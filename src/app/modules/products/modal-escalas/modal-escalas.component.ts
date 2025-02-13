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

  stateEscalaDesactiveActivate(e: any) {
    const mensajeConfirmacion = e.state === 1 
      ? `¿Deseas desactivar la escala de ${e.cantidad} a S/ ${e.precio}?`
      : `¿Deseas activar la escala de ${e.cantidad} a S/ ${e.precio}?`;
  
    const iconoAnimacion = '/assets/animations/general/alerta.json';
    const textoBotonConfirmar = e.state === 1 ? 'Si, desactivemoslo' : 'Si, activémoslo';
    const estadoNuevo = e.state === 1 ? 0 : 1;  // Si está activo (1), desactivamos (0), y viceversa
  
    // Mostrar la confirmación de SweetAlert
    this.sweet.confirmar_habilitado_deshabilitado('¿Estás seguro?', mensajeConfirmacion, iconoAnimacion, textoBotonConfirmar).then((result: any) => {
      if (result.isConfirmed) {
        // Hacer la llamada al servicio para actualizar el estado de la escala
        this.productAtributtesService.updateState(this.PRODUCT_ID.id, e.id, estadoNuevo).subscribe({
          next: (resp: any) => {
            // Actualizar el estado de la escala en la lista local
            e.state = estadoNuevo;  // Actualizar el estado de la escala en la lista
            this.sweet.success('Éxito', `La escala ha sido ${estadoNuevo === 1 ? 'activada' : 'desactivada'} correctamente`, '/assets/animations/general/confirmacion_exitoso.json');
          }
        });
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
