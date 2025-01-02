import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-representante-proveedor',
  templateUrl: './comunication-representante-proveedor.component.html',
  styleUrls: ['./comunication-representante-proveedor.component.scss']
})
export class ComunicationRepresentanteProveedorComponent {
  @Input() NUMBER_REPRESENTANTE_SELECTED: { phone: string, name: string };
  user:any = ''
  nameRepresentante:string = ''
  phone:string = ''

  constructor(
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
  ){
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName()  
    this.nameRepresentante = this.NUMBER_REPRESENTANTE_SELECTED.name,
    this.phone = this.NUMBER_REPRESENTANTE_SELECTED.phone
  }
}
