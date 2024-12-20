import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SweetGeografia } from '../../service/service-geografia.service';
import { ServiceDistritoService } from '../service/service-distrito.service';

@Component({
  selector: 'app-edit-distrito',
  templateUrl: './edit-distrito.component.html',
  styleUrls: ['./edit-distrito.component.scss']
})
export class EditDistritoComponent {
  @Output() DistritoE:EventEmitter<any> = new EventEmitter();
  @Input() PROVINCIAS:any = []
  @Input() DISTRITO_SELECTED:any = [];
  name:string = '';
  file_name:any
  imagen_previzualizade:any;
  provincia:string = '';
  state:number = 1;

  sweet:any = new SweetalertService
  sweetGeografia:any = new SweetGeografia;

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public distritoService: ServiceDistritoService,
  ){

  }

  ngOnInit(): void {
    this.name = this.DISTRITO_SELECTED.name,
    this.file_name = this.DISTRITO_SELECTED.image,
    this.state = this.DISTRITO_SELECTED.state,
    this.provincia = this.DISTRITO_SELECTED.idprovincia
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
    formData.append("state", this.state.toString());

    this.distritoService.updateDistrito(this.DISTRITO_SELECTED.id,formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweetGeografia.confirmar_restauracion('Atencion', resp.message_text);
          this.sweetGeografia.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.distrito);
            }
          })
        } else if (resp.message == 403) {
          this.sweet.alerta('Ups', resp.message_text);
        } else {
          this.DistritoE.emit({distrito:resp.distrito, isRestored: false});
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el distrito se actualizo correctamente');
        }
      },

      error: (error) => {
        // Lógica cuando ocurre un error
        this.sweet.error(error.status);
        //console.log(error.status)
      },
    });
  }

  restaurar(prov:any){
    this.distritoService.restaurarDistrito(prov).subscribe({
      next: (resp: any) => {
        if (resp.message === 403) {
          this.sweet.error('Error', resp.message_text);
        } else {
          this.DistritoE.emit({distrito:resp.distrito_restaurado, isRestored: true});
          this.modal.close();
          this.sweet.success('¡Restaurado!', resp.message_text, '/assets/animations/general/restored.json');
        }
      },
      error: (error) => {
        this.sweet.error(error.status);
      }
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
