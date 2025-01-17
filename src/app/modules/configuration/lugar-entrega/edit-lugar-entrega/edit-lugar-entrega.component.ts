import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';
import { LugarEntregaService } from '../service/lugar-entrega.service';

@Component({
  selector: 'app-edit-lugar-entrega',
  templateUrl: './edit-lugar-entrega.component.html',
  styleUrls: ['./edit-lugar-entrega.component.scss']
})
export class EditLugarEntregaComponent {
  @Output() LugarEntregaE:EventEmitter<any> = new EventEmitter();
  @Input() LUGAR_ENTREGA_SELECTED:any;

  name:string = '';
  address:string = '';
  state:number = 1;
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
    this.name = this.LUGAR_ENTREGA_SELECTED.name;
    this.address = this.LUGAR_ENTREGA_SELECTED.address;
    this.state = this.LUGAR_ENTREGA_SELECTED.state;
  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del lugar de entrega es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      state: this.state,
      destination_coordinates: this.coordenadas,
    }

    this.lugarEntregaService.updateLugarEntrega(this.LUGAR_ENTREGA_SELECTED.id, data).subscribe({
      next: (resp: any) => {
          this.LugarEntregaE.emit(resp.lugarEntrega);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el lugar de entrega se actualizó correctamente');
      },
    });
  }
}
