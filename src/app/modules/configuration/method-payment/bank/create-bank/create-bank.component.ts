import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalService } from '../../../sucursales/service/sucursal.service';
import { BankService } from '../service/bank-service.service';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent {
  @Output() BancoC:EventEmitter<any> = new EventEmitter();
    name:string = '';
    image:string = '';
  
    sweet:any = new SweetalertService
  
    permisions:any = [];
    constructor(
      public modal: NgbActiveModal,
      //llamamos al servicio
      public bankService: BankService,
    ){
  
    }
  
    ngOnInit(): void {
  
    }
  
  
    store(){
      if(!this.name){
        this.sweet.formulario_invalido("Validacion","El nombre del banco es requerido");
        return false;
      }
  
      let data = {
        name: this.name,
        image: this.image
      }
  
      this.bankService.registerSucursal(data).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 403) {
            this.sweet.alerta('Error', resp.message_text);
          } else {
            this.BancoC.emit(resp.bank);
            this.modal.close();
            this.sweet.success('¡Éxito!', 'El banco se registró correctamente');
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
