import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { LaboratoriosServiceService } from '../service/laboratorios-service.service';
import { CreateProveedorComponent } from '../../../proveedor/create-proveedor/create-proveedor.component';
/* import { SweetRestaurarCategoria } from '../service/restauracionAlert.service'; */

@Component({
  selector: 'app-edit-laboratorios',
  templateUrl: './edit-laboratorios.component.html',
  styleUrls: ['./edit-laboratorios.component.scss']
})

export class EditLaboratoriosComponent {
  @Output() LaboratorioE:EventEmitter<any> = new EventEmitter();
  PROVEEDORES:any = [];
  @Input() LABORATORIO_SELECTED:any = [];
  name:string = '';
  file_name:any;
  imagen_previzualizade:any;
  color:string = '#58BF53';
  margen_minimo:number = 20;
  proveedores:any = [];
  state:number;

  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public laboratorioService: LaboratoriosServiceService,
    public modalService: NgbModal,
  ){

  }

  ngOnInit(): void {
    this.name = this.LABORATORIO_SELECTED.name,
    this.color = this.LABORATORIO_SELECTED.color,
    this.margen_minimo = this.LABORATORIO_SELECTED.margen_minimo,
    this.proveedores = this.LABORATORIO_SELECTED.idproveedor,
    this.state = this.LABORATORIO_SELECTED.state,
    this.imagen_previzualizade = this.LABORATORIO_SELECTED.image,
    this.laboratorioService.obtenerRecursos().subscribe((data: any) => {
      this.PROVEEDORES = data.proveedores;
    });
  }

  store(){

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
    formData.append("state", this.state.toString());
    formData.append("proveedores", JSON.stringify(this.proveedores));

    this.laboratorioService.updateLaboratorio(this.LABORATORIO_SELECTED.id,formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.laboratorio);
            }
          })
        } else {
          this.LaboratorioE.emit({laboratorio:resp.laboratorio, isRestored: false});
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el laboratorio se actualizo correctamente');
        }
      },
    });
  }

  restaurar(prov:any){
    this.laboratorioService.restaurarLaboratorio(prov).subscribe({
      next: (resp: any) => {
        this.LaboratorioE.emit({laboratorio:resp.laboratorio_restaurado, isRestored: true});
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

  crearProveedor(){
      const modalRef = this.modalService.open(CreateProveedorComponent,{centered:true, size: 'md'})
      modalRef.componentInstance.ProveedorC.subscribe((prov:any)=>{
        this.PROVEEDORES = [prov, ...this.PROVEEDORES];
        this.proveedores = [prov.id, ...this.proveedores];
      })
    }
}
