import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { BankService } from '../service/bank-service.service';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.scss']
})
export class EditBankComponent {
  @Output() BankE:EventEmitter<any> = new EventEmitter();
    @Input() BANK_SELECTED:any;
  
    name:string = '';
    image:string = '';
    state:number = 1
  
    sweet:any = new SweetalertService
  
    permisions:any = [];
    constructor(
      public modal: NgbActiveModal,
      //llamamos al servicio
      public bankService: BankService,
    ){
  
    }
  
    ngOnInit(): void {
      this.name = this.BANK_SELECTED.name;
      this.image = this.BANK_SELECTED.address;
      this.state = this.BANK_SELECTED.state;
    }
  
  
    store(){
      if(!this.name){
        this.sweet.formulario_invalido("Validacion","El nombre del banco es requerido");
        return false;
      }
  
      let data = {
        name: this.name,
        image: this.image,
        state: this.state
      }
  
      this.bankService.updateBanco(this.BANK_SELECTED.id, data).subscribe({
        next: (resp: any) => {
          // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
          if (resp.message == 403) {
            this.sweet.alerta('Error', resp.message_text);
          } else {
            this.BankE.emit(resp.bank);
            this.modal.close();
            this.sweet.success('¡Éxito!', 'El banco se actualizó correctamente');
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
