import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { BankService } from '../service/bank-service.service';

@Component({
  selector: 'app-create-bank',
  templateUrl: './create-bank.component.html',
  styleUrls: ['./create-bank.component.scss']
})
export class CreateBankComponent {
  @Output() BancoC:EventEmitter<any> = new EventEmitter();
    name:string = '';
    file_name:any
    imagen_previzualizade:any;
  
    sweet:any = new SweetalertService

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
  
      const formData = new FormData();
      formData.append("name", this.name);
      formData.append("imagebank", this.file_name);
  
      this.bankService.registerBanco(formData).subscribe({
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

    processFile($event:any){
      if($event.target.files[0].type.indexOf("image") < 0){
        this.sweet.formulario_invalido("Atención", "El archivo que seleccionaste no es una imagen")
        return
      }
  
      this.file_name = $event.target.files[0]
      let reader = new FileReader();
      reader.readAsDataURL(this.file_name);
      reader.onloadend = () => this.imagen_previzualizade = reader.result
    }
}
