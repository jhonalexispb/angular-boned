import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';

@Component({
  selector: 'app-edit-warehouse',
  templateUrl: './edit-warehouse.component.html',
  styleUrls: ['./edit-warehouse.component.scss']
})
export class EditWarehouseComponent {
  @Output() WarehouseE:EventEmitter<any> = new EventEmitter();
  @Input() SUCURSALES:any = [];
  @Input() WAREHOUSE_SELECTED:any = [];

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
    this.name = this.WAREHOUSE_SELECTED.name
    this.address = this.WAREHOUSE_SELECTED.address
    this.sucursale_id = this.WAREHOUSE_SELECTED.sucursale_id
  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del almacén es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address: this.address,
      sucursale_id: this.sucursale_id
    }

    this.warehouseService.updateWarehouse(this.WAREHOUSE_SELECTED.id,data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 403) {
          this.sweet.alerta('Error', resp.message_text);
        } else {
          this.WarehouseE.emit(resp.warehouse);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el almacén se actualizó correctamente');
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
