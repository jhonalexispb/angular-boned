import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { LaboratoriosServiceService } from '../service/laboratorios-service.service';
import { CreateProveedorComponent } from '../../../proveedor/create-proveedor/create-proveedor.component';

@Component({
  selector: 'app-create-laboratorios',
  templateUrl: './create-laboratorios.component.html',
  styleUrls: ['./create-laboratorios.component.scss']
})
export class CreateLaboratoriosComponent {
  @Output() LaboratorioC:EventEmitter<any> = new EventEmitter();
  @Input() nombre_externo: any = '';
  PROVEEDORES:any[] = [];
  name:string
  file_name:any
  imagen_previzualizade:any;
  color:string = '#58BF53';
  margen_minimo:number = 20;
  codigo:number
  proveedores:any[] = [];

  loading: boolean = false;
  loading_codigo: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public laboratorioService: LaboratoriosServiceService,
    public modalService: NgbModal,
  ){

  }

  ngOnInit(): void {
    this.name = this.nombre_externo
    this.loading = true;
    this.loading_codigo = true;
    this.laboratorioService.obtenerRecursos().subscribe((data: any) => {
      this.PROVEEDORES = data.proveedores;
      this.loading = false;
    });
    this.laboratorioService.obtenerRecursosParaCrear().subscribe((data: any) => {
      this.codigo = data.codigo;
      this.loading_codigo = false;
    });
  }

  crearProveedor(){
    const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.ProveedorC.subscribe((prov:any)=>{
      this.PROVEEDORES = [prov, ...this.PROVEEDORES];
      this.proveedores = [prov.id, ...this.proveedores];
    })
  }

  store(){
    if(!this.codigo){
      this.sweet.formulario_invalido("Validacion","el codigo del laboratorio es requerido");
      return false;
    }

    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del laboratorio es requerido");
      return false;
    }

    if(this.proveedores.length < 1){
      this.sweet.formulario_invalido("Validacion","el laboratorio debe de tener asociado al menos un proveedor");
      return false;
    }

    const formData = new FormData();
    formData.append("name", this.name);
    if (this.file_name) {
      formData.append('image_laboratorio', this.file_name);
    }

    formData.append("margen_minimo", this.margen_minimo.toString());
    formData.append("color", this.color);
    formData.append("proveedores", JSON.stringify(this.proveedores));

    this.laboratorioService.registerLaboratorio(formData).subscribe({
      next: (resp: any) => {
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.laboratorio);
            }
          })
        } else { 
          this.LaboratorioC.emit(resp.laboratorio);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el laboratorio se registró correctamente');
        }
      },
    });
  }

  restaurar(prov:any){
    this.laboratorioService.restaurarLaboratorio(prov).subscribe({
      next: (resp: any) => {
        this.LaboratorioC.emit(resp.laboratorio_restaurado);
        this.modal.close();
        this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
      },
    })
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
