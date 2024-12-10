import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetalertService } from '../service/sweetalertusers.service';
import { UserService } from '../service/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  @Output() UserE:EventEmitter<any> = new EventEmitter();
  @Input() roles:any = []
  @Input() USER_SELECTED:any
  name:string = '';
  surname:string = '';
  email:string = '';
  phone:string = '';
  role_id:string = '';
  gender:string = '';
  n_document:string = '';
  password:string = '';
  password_repeat:string = ''

  file_name:any
  imagen_previzualizade:any;

  isLoading:any
  sweet:any = new SweetalertService

  constructor(
    public modal: NgbActiveModal,
    //llamamos al servicio
    public userService: UserService,
    public toast: ToastrService,
  ){

  }

  ngOnInit(): void {
    this.name = this.USER_SELECTED.name
    this.surname = this.USER_SELECTED.surname
    this.email = this.USER_SELECTED.email
    this.phone = this.USER_SELECTED.phone
    this.role_id = this.USER_SELECTED.role_id
    this.gender = this.USER_SELECTED.gender
    this.n_document = this.USER_SELECTED.n_document
    this.imagen_previzualizade = this.USER_SELECTED.avatar
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN", "El archivo no es una iamgen")
      return
    }

    this.file_name = $event.target.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => this.imagen_previzualizade = reader.result
  }
  store(){
    if(!this.name){
      this.sweet.formulario_invalido("Validacion","El nombre es requerido");
      return false;
    }

    if(!this.phone){
      this.sweet.formulario_invalido("Validacion","El telefono es requerido");
      return false;
    }

    if(!this.gender){
      this.sweet.formulario_invalido("Validacion","El genero es requerido");
      return false;
    }

    if(!this.role_id){
      this.sweet.formulario_invalido("Validacion","El rol es requerido");
      return false;
    }

    if(this.password && this.password != this.password_repeat){
      this.sweet.formulario_invalido("Validacion","Las constraseñas no coinciden");
      return false;
    }


    let formData = new FormData();

    formData.append("name",this.name)
    formData.append("surname",this.surname)
    formData.append("email",this.email)
    formData.append("phone",this.phone)
    formData.append("role_id",this.role_id)
    formData.append("gender",this.gender)
    formData.append("n_document",this.n_document)

    if(this.file_name){
      formData.append("imagen",this.file_name)
    }

    if(this.password){
      formData.append("password",this.password)
    }

    this.userService.updateUser(this.USER_SELECTED.id,formData).subscribe({
      next: (resp: any) => {
        // Lógica cuando se recibe un valor (respuesta exitosa o fallida)
        if (resp.message == 403) {
          this.sweet.alerta('Error', resp.message_text);
        } else {
          this.UserE.emit(resp.user);
          this.modal.close();
          this.sweet.success('¡Éxito!', 'El usuario se actualizo correctamente');
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
