import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceProvinciaService } from '../service/service-provincia.service';

@Component({
  selector: 'app-create-provincia',
  templateUrl: './create-provincia.component.html',
  styleUrls: ['./create-provincia.component.scss']
})
export class CreateProvinciaComponent {
  @Output() ProvinciaC:EventEmitter<any> = new EventEmitter();
  @Input()  DEPARTAMENTOS:any = []
  name:string = '';
  file_name:any
  imagen_previzualizade:any;
  departamento:null;

  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public provinciaService: ServiceProvinciaService,
  ){

  }

  ngOnInit(): void {
    
  }

  store(){

    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre de la provincia es requerida");
      return false;
    }

    if(!this.departamento){
      this.sweet.formulario_invalido("Validacion","la provincia debe de pertenecer a un departamento");
      return false;
    }

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("image_provincia", this.file_name);
    formData.append("iddepartamento", this.departamento);

    this.provinciaService.registerProvincia(formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.provincia);
            }
          })
        } else {
          this.ProvinciaC.emit(resp.provincia);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'la provincia se registró correctamente');
        }
      },
    });
  }

  restaurar(prov:any){
    this.provinciaService.restaurarProvincia(prov).subscribe({
      next: (resp: any) => {
          this.ProvinciaC.emit(resp.provincia_restaurada);
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

