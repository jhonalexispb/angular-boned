import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { ServiceDepartamentoService } from '../service/service-departamento.service';
import { SweetGeografia } from '../../service/service-geografia.service';

@Component({
  selector: 'app-edit-departamento',
  templateUrl: './edit-departamento.component.html',
  styleUrls: ['./edit-departamento.component.scss']
})
export class EditDepartamentoComponent {
  @Output() DepartamentoE:EventEmitter<any> = new EventEmitter();
  @Input() DEPARTAMENTO_SELECTED:any;
  name:string = '';
  file_name:any
  imagen_previzualizade:any;
  state:number = 1;

  sweet:any = new SweetalertService;
  sweetGeografia:any = new SweetGeografia;

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public departamentoService: ServiceDepartamentoService,
  ){

  }

  ngOnInit(): void {
    this.name = this.DEPARTAMENTO_SELECTED.name,
    this.file_name = this.DEPARTAMENTO_SELECTED.image,
    this.state = this.DEPARTAMENTO_SELECTED.state
  }

  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","El nombre de departamento es requerido")
      return false
    }

    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("state", this.state.toString());
    formData.append("image_department", this.file_name);

    this.departamentoService.updateDepartamento(this.DEPARTAMENTO_SELECTED.id,formData).subscribe({
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
          this.sweet.alerta('Error', resp.message_text);
        } else {
          this.DepartamentoE.emit({ departamento: resp.departamento, isRestored: false });
          this.modal.close();
          this.sweet.success('¡Éxito!', 'El departamento se actualizo correctamente');
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
          this.DepartamentoE.emit({ departamento: resp.departamento_restaurado, isRestored: true });
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
