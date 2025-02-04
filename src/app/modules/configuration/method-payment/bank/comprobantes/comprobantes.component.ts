import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalClienteService } from 'src/app/modules/clientes/sucursales/service/sucursalCliente.service';
import { CreateRelacionBancoComprobanteComponent } from '../create-relacion-banco-comprobante/create-relacion-banco-comprobante.component';
import { EditRelacionBancoComprobanteComponent } from '../edit-relacion-banco-comprobante/edit-relacion-banco-comprobante.component';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { BankService } from '../service/bank-service.service';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.scss']
})
export class ComprobantesComponent {
  @Input() BANK_TO_SELECTED: any = [];

  activeDropdownIndex: number | null = null;
  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    //llamamos al servicio
    public clienteSucursalService: SucursalClienteService,
    public bankService: BankService
  ) {}

  ngOnInit(): void {
  }

  crearRelacionBancoComprobante(BANK:any){
    const modalRef = this.modalService.open(CreateRelacionBancoComprobanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.BANK_RELATION_SELECTED = BANK
    modalRef.componentInstance.BANK_RELATION_SELECTED.name = this.BANK_TO_SELECTED.name;
    modalRef.componentInstance.relacionBancoComprobanteC.subscribe((bank:any)=>{
      this.BANK_TO_SELECTED.comprobantes.push(bank); //integra el nuevo valor al inicio de la tabla
    })
  }

  editRelacion(BANK:any){
      const modalRef = this.modalService.open(EditRelacionBancoComprobanteComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.BANK_RELATION_SELECTED = BANK;
      modalRef.componentInstance.relacionBancoComprobanteE.subscribe((bank:any)=>{
        let INDEX = this.BANK_TO_SELECTED.findIndex((b:any) => b.id == BANK.id);
        if(INDEX != -1){
          this.BANK_TO_SELECTED[INDEX] = bank
        }
      })
    }

  deleteRelacion(RELACION:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el comprobante ${RELACION.comprobante.name} del banco ${this.BANK_TO_SELECTED.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.bankService.deleteBanco(RELACION.id).subscribe({
          next: (resp: any) => {
            this.BANK_TO_SELECTED = this.BANK_TO_SELECTED.filter((b:any) => b.id !== RELACION.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El banco ha sido eliminado correctamente');
          }
        })
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
