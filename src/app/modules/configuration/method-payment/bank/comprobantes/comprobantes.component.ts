import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalClienteService } from 'src/app/modules/clientes/sucursales/service/sucursalCliente.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-comprobantes',
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.scss']
})
export class ComprobantesComponent {
  @Input() BANK_TO_SELECTED: any = [];

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public clienteSucursalService: SucursalClienteService
  ) {}

  ngOnInit(): void {
    this.clienteSucursalService.obtenerRecursosParaGestionar(this.BANK_TO_SELECTED.id).subscribe((data: any) => {
      
    });
  }

   
}
