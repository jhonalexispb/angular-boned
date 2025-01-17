import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';
import { LugarEntregaService } from '../service/lugar-entrega.service';

@Component({
  selector: 'app-create-lugar-entrega',
  templateUrl: './create-lugar-entrega.component.html',
  styleUrls: ['./create-lugar-entrega.component.scss']
})
export class CreateLugarEntregaComponent {
  @Output() LugarEntregaC:EventEmitter<any> = new EventEmitter();
  name:string = '';
  address:string = '';
  coordenadas:string = '';

  sweet:any = new SweetalertService

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public lugarEntregaService: LugarEntregaService,
  ){

  }

  ngOnInit(): void {

  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del lugar de entrega es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      destination_coordinates: this.coordenadas
    }

    this.lugarEntregaService.registerLugarEntrega(data).subscribe({
      next: (resp: any) => {
          this.LugarEntregaC.emit(resp.lugarEntrega);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el lugar de entrega se registró correctamente');
      },
    });
  }
}
