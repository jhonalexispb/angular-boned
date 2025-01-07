import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { SweetRestaurarCategoria } from '../../categorias/service/restauracionAlert.service';
import { LaboratoriosServiceService } from '../service/laboratorios-service.service';

@Component({
  selector: 'app-create-laboratorios',
  templateUrl: './create-laboratorios.component.html',
  styleUrls: ['./create-laboratorios.component.scss']
})
export class CreateLaboratoriosComponent {
  @Output() LaboratorioC:EventEmitter<any> = new EventEmitter();
  name:string = '';
  file_name:any
  imagen_previzualizade:any;
  color:string = '#58BF53';
  margen_minimo:number = 20;

  loading: boolean = false;

  sweet:any = new SweetalertService
  sweetRestaurarCategoria:any = new SweetRestaurarCategoria;

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public laboratorioService: LaboratoriosServiceService,
  ){

  }

  ngOnInit(): void {
    
  }

  store(){

    if(!this.name){
      this.sweet.formulario_invalido("Validacion","el nombre del laboratorio es requerido");
      return false;
    }

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("image_laboratorio", this.file_name);

    this.laboratorioService.registerLaboratorio(formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if(resp.message == 409){
          this.sweetRestaurarCategoria.confirmar_restauracion('Atencion', resp.message_text);
          this.sweetRestaurarCategoria.getRestauracionObservable().subscribe((confirmed:boolean) => {
            if (confirmed) {
              this.restaurar(resp.laboratorio);
            }
          })
        } else if (resp.message == 403) {
          this.sweet.alerta('Ups', resp.message_text);
        } else {
          this.LaboratorioC.emit(resp.laboratorio);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'el laboratorio se registró correctamente');
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
    this.laboratorioService.restaurarLaboratorio(prov).subscribe({
      next: (resp: any) => {
        if (resp.message === 403) {
          this.sweet.error('Error', resp.message_text);
        } else {
          this.LaboratorioC.emit(resp.laboratorio_restaurado);
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
