import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SucursalService } from '../service/sucursal.service';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-edit-sucursal',
  templateUrl: './edit-sucursal.component.html',
  styleUrls: ['./edit-sucursal.component.scss']
})
export class EditSucursalComponent {
  @Output() SucursalE:EventEmitter<any> = new EventEmitter();
  @Input() SUCURSAL_SELECTED:any;

  name:string = '';
  address:string = '';
  state:number = 1

  sweet:any = new SweetalertService

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public sucursalService: SucursalService,
    public toast: ToastrService,
  ){

  }

  ngOnInit(): void {
    this.name = this.SUCURSAL_SELECTED.name;
    this.address = this.SUCURSAL_SELECTED.address;
    this.state = this.SUCURSAL_SELECTED.state;
  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","El nombre de la sucursal es requerida");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      state: this.state
    }

    this.sucursalService.updateSucursal(this.SUCURSAL_SELECTED.id, data).subscribe({
      next: (resp: any) => {
          this.SucursalE.emit(resp.sucursal);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'La sucursal se actualizó correctamente');
      },
    });
  }
}
