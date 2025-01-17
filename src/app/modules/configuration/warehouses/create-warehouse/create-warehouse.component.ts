import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})
export class CreateWarehouseComponent {
  @Output() WarehouseC:EventEmitter<any> = new EventEmitter();
  @Input() SUCURSALES:any = [];
  name:string = '';
  address:string = '';
  sucursale_id:string = '';

  sweet:any = new SweetalertService

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public warehouseService: WarehouseService,
  ){

  }

  ngOnInit(): void {

  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Paremos aquí","el nombre del almacén es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      sucursale_id: this.sucursale_id
    }

    this.warehouseService.registerWarehouse(data).subscribe({
      next: (resp: any) => {
        this.WarehouseC.emit(resp.warehouse);
        this.modal.close();
        this.sweet.success('¡Éxito!', 'el almacén se registró correctamente');
      }
    });
  }
}
