import { Component, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SucursalClienteService } from '../service/sucursalCliente.service';
import { CreateSucursalesComponent } from '../create-sucursales/create-sucursales.component';
import { EditSucursalesComponent } from '../edit-sucursales/edit-sucursales.component';
import { ComunicationPersonComponent } from 'src/app/components/comunication-person/comunication-person.component';
import { GestionarSucursalesComponent } from '../gestionar-sucursales/gestionar-sucursales.component';

@Component({
  selector: 'app-list-sucursales',
  templateUrl: './list-sucursales.component.html',
  styleUrls: ['./list-sucursales.component.scss']
})
export class ListSucursalesComponent {
  search:any;
  SUCURSALES_LIST:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;

  constructor(
    public modalService: NgbModal,
    public sucursalesService: SucursalClienteService,
  ){

  }

  ngOnInit(): void {
    this.listSucursalesClientes();
  }

  onSearchChange() {
    if (this.search === null) {
      this.search = ''; // Convertir null a cadena vacía
    }
    this.listSucursalesClientes(); // Llamar a tu función para actualizar la lista
    if(this.search === ''){
      this.search = null
    }
  }

  listSucursalesClientes(page = 1){
    this.sucursalesService.listSucursalCliente(page,this.search).subscribe((resp: any) => {
      this.SUCURSALES_LIST = resp.cliente_sucursales;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listSucursalesClientes(page);
  }

  createSucursalCliente(buscarCoordenada:boolean){
    const modalRef = this.modalService.open(CreateSucursalesComponent,{centered:true, size: 'md'})
    if(buscarCoordenada){
      modalRef.componentInstance.capturar_coordenadas_al_abrir = true;
    }
    modalRef.componentInstance.ClienteSucursalC.subscribe((r:any)=>{
      this.SUCURSALES_LIST.unshift(r); //integra el nuevo valor al inicio de la tabla
    })
  }

  editSucursalCliente(R:any){
    const modalRef = this.modalService.open(EditSucursalesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.CLIENTE_SUCURSAL_SELECTED = R;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.ClienteSucursalE.subscribe((r:any)=>{
        let INDEX = this.SUCURSALES_LIST.findIndex((b:any) => b.id == R.id);
        if(INDEX != -1){
          this.SUCURSALES_LIST[INDEX] = r
        }
    })
  }

  preguntaPorUbicacion(){
    this.sweet.confirmar('Antes de todo', `¿Te encuentras en el estableciemiento? O estas creando el cliente en una combi`,'/assets/animations/general/ubicacion.json','Si, estoy con el cliente',true,'No, estoy en otro lado').then((result:any) => {
      if (result.isConfirmed) {
        this.createSucursalCliente(true)
      }else{
        this.createSucursalCliente(false)
      }
    });
  }

  comunicationClienteSucursal(DATOS:any){
    const modalRef = this.modalService.open(ComunicationPersonComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.NUMBER_SELECTED = {
      phone: DATOS[0],  // Celular
      persona: DATOS[1]    // Nombre
    };
  }

  deleteSucursalCliente(SUC_CL:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar la sucursal: ${SUC_CL.nombre_comercial} de ${SUC_CL.ruc} ${SUC_CL.razon_social}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.sucursalesService.deleteSucursalCliente(SUC_CL.id).subscribe({
          next: (resp: any) => {
            this.SUCURSALES_LIST = this.SUCURSALES_LIST.filter((sucurs:any) => sucurs.id !== SUC_CL.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'La sucursal ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }

  gestionarSucursal(SUC_CL:any){
    const modalRef = this.modalService.open(GestionarSucursalesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.CLIENTE_SUCURSAL_TO_SELECTED = SUC_CL;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.ClienteGestionE.subscribe((r:any)=>{
        let INDEX = this.SUCURSALES_LIST.findIndex((b:any) => b.id == SUC_CL.id);
        if(INDEX != -1){
          this.SUCURSALES_LIST[INDEX] = r
        }
    })
  }

  // Método que se ejecuta cuando un dropdown es activado o desactivado
  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }
}
