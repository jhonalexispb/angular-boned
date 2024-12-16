import { Component } from '@angular/core';
import { WarehouseService } from '../service/warehouse.service';
import { SweetalertService } from '../../../sweetAlert/sweetAlert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWarehouseComponent } from '../create-warehouse/create-warehouse.component';
import { EditWarehouseComponent } from '../edit-warehouse/edit-warehouse.component';

@Component({
  selector: 'app-list-warehouse',
  templateUrl: './list-warehouse.component.html',
  styleUrls: ['./list-warehouse.component.scss']
})
export class ListWarehouseComponent {
  search:string = '';
  WAREHOUSES:any = [];
  SUCURSALES:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  

  constructor(
    public modalService: NgbModal,
    public warehouseService: WarehouseService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.warehouseService.isLoading$;
    this.listWarehouses();
  }

  listWarehouses(page = 1){
    this.warehouseService.listWarehouses(page,this.search).subscribe((resp: any) => {
      this.WAREHOUSES = resp.warehouses;
      this.totalPages = resp.total;
      this.currentPage = page;
      this.SUCURSALES = resp.sucursales;
    })
  }

  loadPage($event:any){
    this.listWarehouses($event);
  }

  createWarehouse(){
    const modalRef = this.modalService.open(CreateWarehouseComponent,{centered:true, size: 'md'})
    //Le pasamos la lista de sucursales para el select
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES
    modalRef.componentInstance.WarehouseC.subscribe((warehouse:any)=>{
      this.WAREHOUSES.unshift(warehouse); //integra el nuevo valor al inicio de la tabla
    })
  }

  editWarehouse(WAREHOUSE:any){
    const modalRef = this.modalService.open(EditWarehouseComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.WarehouseE.subscribe((warehouse:any)=>{
      let INDEX = this.WAREHOUSES.findIndex((ware:any) => ware.id == WAREHOUSE.id);
      if(INDEX != -1){
        this.WAREHOUSES[INDEX] = warehouse
      }
    })
  }

  deleteWarehouse(WAREHOUSE:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el almacén: ${WAREHOUSE.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.warehouseService.deleteWarehouse(WAREHOUSE.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.WAREHOUSES = this.WAREHOUSES.filter((ware:any) => ware.id !== WAREHOUSE.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'el almacén ha sido eliminado correctamente');
            }
          },
          error: (error) => {
            this.sweet.error(error.status);
          }
        })
      }
    });
  }
}
