import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { LaboratoriosServiceService } from '../service/laboratorios-service.service';
import { CreateLaboratoriosComponent } from '../create-laboratorios/create-laboratorios.component';
import { EditLaboratoriosComponent } from '../edit-laboratorios/edit-laboratorios.component';
import { ImportExcelComponent } from 'src/app/components/import-excel/import-excel.component';
import { ViewImageComponent } from 'src/app/components/view-image/view-image.component';

@Component({
  selector: 'app-list-laboratorios',
  templateUrl: './list-laboratorios.component.html',
  styleUrls: ['./list-laboratorios.component.scss']
})
export class ListLaboratoriosComponent {
  search:string = '';
  LABORATORIOS:any = [];
  sweet:any = new SweetalertService

  totalPages:number = 0; 
  currentPage:number = 1;
  activeDropdownIndex: number | null = null;

  constructor(
    public modalService: NgbModal,
    public laboratorioService: LaboratoriosServiceService,
  ){

  }

  ngOnInit(): void {
    this.listLaboratorio();
  }

  listLaboratorio(page = 1){
    this.laboratorioService.listLaboratorio(page,this.search).subscribe((resp: any) => {
      this.LABORATORIOS = resp.laboratorio;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage(page: number) {
    this.listLaboratorio(page);
  }

  createLaboratorio(){
    const modalRef = this.modalService.open(CreateLaboratoriosComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.LaboratorioC.subscribe((lab:any)=>{
      this.LABORATORIOS.unshift(lab); //integra el nuevo valor al inicio de la tabla
    })
  }

  editLaboratorio(LAB:any){
    const modalRef = this.modalService.open(EditLaboratoriosComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.LABORATORIO_SELECTED = LAB;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    modalRef.componentInstance.LaboratorioE.subscribe((lab:any)=>{
      const { laboratorio, isRestored } = lab; 
      if (isRestored) {
        this.LABORATORIOS.unshift(laboratorio);
      } else {
        let INDEX = this.LABORATORIOS.findIndex((b:any) => b.id == LAB.id);
        if(INDEX != -1){
          this.LABORATORIOS[INDEX] = laboratorio
        }
      }
    })
  }

  deleteLaboratorio(LAB:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el laboratorio: ${LAB.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.laboratorioService.deleteLaboratorio(LAB.id).subscribe({
          next: () => {
            this.LABORATORIOS = this.LABORATORIOS.filter((sucurs:any) => sucurs.id !== LAB.id); // Eliminamos el rol de la lista
            this.sweet.success('Eliminado', 'El laboratorio ha sido eliminado correctamente','/assets/animations/general/borrado_exitoso.json');
          },
        })
      }
    });
  }

  handleDropdownToggle(index: number) {
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  importLaboratorio(){
    const modalRef = this.modalService.open(ImportExcelComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.nameModule = "laboratorios"
    modalRef.componentInstance.route = "/laboratorio/tool/import"
    modalRef.componentInstance.ImportExcelC.subscribe((r:any)=>{
      
    })
  }

  viewImagen(image:string){
    const modalRef = this.modalService.open(ViewImageComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.IMAGE_SELECTED = image
  }
}
