import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';
import { AtributteProductsService } from '../service/atributte-products.service';
import { CreateLotesComponent } from '../create-lotes/create-lotes.component';
import { EditLotesComponent } from '../edit-lotes/edit-lotes.component';

@Component({
  selector: 'app-modal-lotes',
  templateUrl: './modal-lotes.component.html',
  styleUrls: ['./modal-lotes.component.scss']
})
export class ModalLotesComponent {
  @Input() PRODUCT_ID:any = [];
  LOTES_LIST:any = [];
  lotes_activos:any = 0;
  lotes_inactivos:any = 0;
  stock:any = 'Solicitando stock';
  user:any = ''
  sweet:any = new SweetalertService
  activeDropdownIndex: number | null = null;
  isLoading: boolean = true;

  constructor(
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
    public productAtributtesService: AtributteProductsService,
    public modalService: NgbModal,
  ){
    
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName() 
    this.productAtributtesService.listLotes(this.PRODUCT_ID.id).subscribe({
      next: (resp: any) => {
        this.LOTES_LIST = resp.lotes
        this.lotes_activos = resp.lotes_activos
        this.lotes_inactivos = resp.lotes_inactivos
        this.stock = resp.stock
        this.isLoading = false;
      },
    })
  }

  createLote(){
    const modalRef = this.modalService.open(CreateLotesComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.PRODUCT_ID = this.PRODUCT_ID
    modalRef.componentInstance.LoteC.subscribe((r:any)=>{
      this.LOTES_LIST.unshift(r.lotes);
      // Actualizamos las listas activas e inactivas
      this.lotes_activos = r.lotes_activos;
      this.lotes_inactivos = r.lotes_inactivos;

      this.LOTES_LIST.sort((a: any, b: any) => 
        new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime()
      );
    })
  }

  editLote(e:any){
    const modalRef = this.modalService.open(EditLotesComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.LOTE_ID_SELECTED = e
    modalRef.componentInstance.PRODUCT_SELECTED = this.PRODUCT_ID
    modalRef.componentInstance.LoteE.subscribe((r:any)=>{
      let INDEX = this.LOTES_LIST.findIndex((b:any) => b.id == e.id);
        if(INDEX != -1){
          this.LOTES_LIST[INDEX] = r.lotes
        }
        this.LOTES_LIST.sort((a: any, b: any) => 
          new Date(a.fecha_vencimiento).getTime() - new Date(b.fecha_vencimiento).getTime()
        );

      this.lotes_activos = r.lotes_activos;
      this.lotes_inactivos = r.lotes_inactivos;
    })
  }

  deleteLote(e:any){
    const fechaISO = e.fecha_vencimiento;
    const fechaObj = new Date(fechaISO);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaObj.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${año}`;
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el lote ${e.lote} con fecha ${fechaFormateada}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.productAtributtesService.deleteLote(this.PRODUCT_ID.id,e.id).subscribe({
          next: (resp: any) => {
            this.LOTES_LIST = this.LOTES_LIST.filter((esc:any) => esc.id !== e.id); // Eliminamos el rol de la lista
            this.lotes_activos = resp.lotes_activos;
            this.lotes_inactivos = resp.lotes_inactivos;
            this.sweet.success('Eliminado', 'El lote ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
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
    
      // Operación para una escala específica
    if (e == null) {
      return;
    }

    const fechaISO = e.fecha_vencimiento;
    const fechaObj = new Date(fechaISO);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaObj.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${año}`;
    
    mensajeConfirmacion = e.state === 1 
      ? `¿Deseas desactivar el lote ${e.lote} con fecha ${fechaFormateada} para el producto ${this.PRODUCT_ID.laboratorio} ${this.PRODUCT_ID.nombre_completo}?`
      : `¿Deseas activar el lote ${e.lote} con fecha ${fechaFormateada} para el producto ${this.PRODUCT_ID.laboratorio} ${this.PRODUCT_ID.nombre_completo}?`;

    iconoAnimacion = '/assets/animations/general/alerta.json';
    textoBotonConfirmar = e.state === 1 ? 'Si, desactivemoslo' : 'Si, activémoslo';
    const estadoNuevo = e.state === 1 ? 0 : 1;
    mensajeConformidad = `El lote ha sido ${estadoNuevo === 1 ? 'activado' : 'desactivado'} correctamente`;
    data = { 'state': estadoNuevo };
    
  
    // Confirmación de SweetAlert
    this.sweet.confirmar_habilitado_deshabilitado('¿Estás seguro?', mensajeConfirmacion, iconoAnimacion, textoBotonConfirmar).then((result: any) => {
      if (result.isConfirmed) {
        // Llamada al servicio para actualizar el estado de la escala (general o específica)
        this.productAtributtesService.updateStateLote(this.PRODUCT_ID.id, e ? e.id : null, data).subscribe({
          next: (resp: any) => {
              // Actualización a nivel específico
            let INDEX = this.LOTES_LIST.findIndex((b: any) => b.id == e.id);
            if (INDEX != -1) {
              this.LOTES_LIST[INDEX] = resp.lotes;
            }
            this.lotes_activos = resp.lotes_activos;
            this.lotes_inactivos = resp.lotes_inactivos;
            this.sweet.success('Éxito', mensajeConformidad);
          }
        });
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
}
