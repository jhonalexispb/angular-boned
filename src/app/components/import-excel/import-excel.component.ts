import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ImportExcelService } from './import-excel.service';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.scss']
})
export class ImportExcelComponent {
  @Output() ImportExcelC:EventEmitter<any> = new EventEmitter();
  @Input() nameModule:string = '' 
  @Input() route:string = '' 
  file_excel:any

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    //llamamos al servicio
    public importService: ImportExcelService
  ) {}

  ngOnInit(): void {
  }

  // Enviar el formulario
  store() {
    if(!this.file_excel){
      this.sweet.formulario_invalido('Ups','El archivo es requerido')
      return false
    }

    
    let formData = new FormData
    formData.append("import_file",this.file_excel)
    
    this.importService.importExcel(formData,this.route).subscribe({
      next: (resp: any) => {
        this.modal.close();
        this.sweet.success(
          '¡Éxito!',
          'el archivo se importó correctamente'
        );
        this.ImportExcelC.emit(resp);
      },
    })
    

  }

  processFile($event:any){
    const file  = $event.target.files[0]
    const fileType = file.type;
    if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && fileType !== 'application/vnd.ms-excel') {
      this.sweet.formulario_invalido('Error', 'Por favor sube un archivo Excel válido');
      this.file_excel = null;  // Limpiar el archivo si no es válido
      return false;  // Detener el proceso
    }else{
      this.file_excel = file;
    }
  }
}
