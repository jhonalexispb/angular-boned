import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetalertService } from 'src/app/modules/roles/service/sweetalert.service';
import { MethodService } from '../service/method.service';

@Component({
  selector: 'app-edit-method',
  templateUrl: './edit-method.component.html',
  styleUrls: ['./edit-method.component.scss']
})
export class EditMethodComponent {
  @Output() MethodE:EventEmitter<any> = new EventEmitter();
  @Input() METHOD_SELECTED:any;

  name:string = '';
  image:string = '';
  state:number = 1

  sweet:any = new SweetalertService

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public methodService: MethodService,
    public toast: ToastrService,
  ){

  }

  ngOnInit(): void {
    this.name = this.METHOD_SELECTED.name;
    this.image = this.METHOD_SELECTED.image;
    this.state = this.METHOD_SELECTED.state;
  }


  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","El nombre del metodo es requerido");
      return false;
    }

    let data = {
      name: this.name,
      image: this.image,
      state: this.state
    }

    this.methodService.updateMetodo(this.METHOD_SELECTED.id, data).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 403) {
          this.sweet.alerta('Error', resp.message_text);
        } else {
          this.MethodE.emit(resp.method_payment);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'El método se actualizó correctamente');
        }
      },
      error: (error) => {
        // Lógica cuando ocurre un error
        this.sweet.error(error.status);
        //console.log(error.status)
      },
    });
  }
}
