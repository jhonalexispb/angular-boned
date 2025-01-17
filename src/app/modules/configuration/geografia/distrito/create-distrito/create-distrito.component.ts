import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceDistritoService } from '../service/service-distrito.service';

@Component({
  selector: 'app-create-distrito',
  templateUrl: './create-distrito.component.html',
  styleUrls: ['./create-distrito.component.scss']
})
export class CreateDistritoComponent {
  @Output() DistritoC:EventEmitter<any> = new EventEmitter();
  @Input()  PROVINCIAS:any = []
  name:string = '';
  file_name:any
  imagen_previzualizade:any;
  provincia:null;

  loading: boolean = false;

  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public distritoService: ServiceDistritoService,
  ){

  }

  ngOnInit(): void {
    
  }

  store(){

    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del distrito es requerido");
      return false;
    }

    if(!this.provincia){
      this.sweet.formulario_invalido("Validacion","el distrito debe de pertenecer a una provincia");
      return false;
    }

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("image_distrito", this.file_name);
    formData.append("idprovincia", this.provincia);

    this.distritoService.registerDistrito(formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweet.confirmar_restauracion('Atencion', resp.message_text);
          this.sweet.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.distrito);
            }
          })
        } else {
          this.DistritoC.emit(resp.distrito);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el distrito se registró correctamente');
        }
      },
    });
  }

  restaurar(prov:any){
    this.distritoService.restaurarDistrito(prov).subscribe({
      next: (resp: any) => {
          this.DistritoC.emit(resp.distrito_restaurado);
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
