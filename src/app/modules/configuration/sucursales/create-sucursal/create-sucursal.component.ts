import { Component, EventEmitter, Output } from '@angular/core';
import { SucursalService } from '../service/sucursal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';

@Component({
  selector: 'app-create-sucursal',
  templateUrl: './create-sucursal.component.html',
  styleUrls: ['./create-sucursal.component.scss']
})
export class CreateSucursalComponent {
  @Output() SucursalC:EventEmitter<any> = new EventEmitter();
  name:string = '';
  address:string = '';

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

  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","El nombre de la sucursal es requerida");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address
    }

    this.sucursalService.registerSucursal(data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 403) {
          this.sweet.alerta('Error', resp.message_text);
        } else {
          this.SucursalC.emit(resp.sucursal);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'La sucursal se registró correctamente');
        }
      },
      error: (error) => {
        // Lógica cuando ocurre un error
        this.sweet.error(error.status);
        //console.log(error.status)
      },
    });
  }
}
