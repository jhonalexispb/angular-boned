import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceDepartamentoService } from '../service/service-departamento.service';
import { SweetGeografia } from '../../service/service-geografia.service';

@Component({
  selector: 'app-create-departamento',
  templateUrl: './create-departamento.component.html',
  styleUrls: ['./create-departamento.component.scss']
})
export class CreateDepartamentoComponent {
  @Output() DepartamentoC:EventEmitter<any> = new EventEmitter();
      name:string = '';
      file_name:any
      imagen_previzualizade:any;
    
      sweet:any = new SweetalertService
      sweetGeografia:any = new SweetGeografia;
  
      constructor(
        public modal: NgbActiveModal,
        //llamamos al servicio
        public departamentoService: ServiceDepartamentoService,
      ){
    
      }
    
      ngOnInit(): void {
      }
  
      store(){
        if(!this.name){
          this.sweet.formulario_invalido("Validacion","el nombre de departamento es requerido");
          return false;
        }
    
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("image_department", this.file_name);
    
        this.departamentoService.registerDepartamento(formData).subscribe({
          next: (resp: any) => {
            // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
            if(resp.message == 409){
              this.sweetGeografia.confirmar_restauracion('Atencion', resp.message_text);
              this.sweetGeografia.getRestauracionObservable().subscribe((confirmed:boolean) => {
                if (confirmed) {
                  this.restaurar(resp.departamento);
                }
              })
            } else if (resp.message == 403) {
              this.sweet.alerta('Ups', resp.message_text);
            } else {
              this.DepartamentoC.emit(resp.departamento);
              this.modal.close();
              this.sweet.success('¡Éxito!', 'El departamento se registró correctamente');
            }
          },

          error: (error) => {
            // Lógica cuando ocurre un error
            this.sweet.error(error.status);
            //console.log(error.status)
          },
        });
      }

      restaurar(DEP:any){
        this.departamentoService.restaurarDepartamento(DEP).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.DepartamentoC.emit(resp.departamento_restaurado);
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
