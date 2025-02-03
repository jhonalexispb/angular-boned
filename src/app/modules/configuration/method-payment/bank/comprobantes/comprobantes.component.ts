import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalClienteService } from 'src/app/modules/clientes/sucursales/service/sucursalCliente.service';
import { CreateRelacionBancoComprobanteComponent } from '../create-relacion-banco-comprobante/create-relacion-banco-comprobante.component';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.scss']
})
export class ComprobantesComponent {
  @Input() BANK_TO_SELECTED: any = [];
  COMPROBANTES: any = []

  activeDropdownIndex: number | null = null;

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    //llamamos al servicio
    public clienteSucursalService: SucursalClienteService
  ) {}

  ngOnInit(): void {
    /* this.clienteSucursalService.obtenerRecursosParaGestionar(this.BANK_TO_SELECTED.id).subscribe((data: any) => {
      
    }); */
  }

  crearRelacionBancoComprobante(BANK:any){
    const modalRef = this.modalService.open(CreateRelacionBancoComprobanteComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.BANK_RELATION_SELECTED = BANK
    modalRef.componentInstance.relacionBancoComprobanteC.subscribe((bank:any)=>{
      this.COMPROBANTES.unshift(bank); //integra el nuevo valor al inicio de la tabla
    })
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
