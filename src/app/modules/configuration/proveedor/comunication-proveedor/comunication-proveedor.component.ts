import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-proveedor',
  templateUrl: './comunication-proveedor.component.html',
  styleUrls: ['./comunication-proveedor.component.scss']
})
export class ComunicationProveedorComponent {
  @Input() NUMBER_REPRESENTANTE_SELECTED: {phone: string, proveedor: string, persona: string};
  user:any = ''
  phone:string = ''
  proveedor:string = ''
  persona:string = ''

  constructor(
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
  ){
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName(),  
    this.phone = this.NUMBER_REPRESENTANTE_SELECTED.phone,
    this.proveedor = this.NUMBER_REPRESENTANTE_SELECTED.proveedor,
    this.persona = this.NUMBER_REPRESENTANTE_SELECTED.persona,
    console.log(this.NUMBER_REPRESENTANTE_SELECTED)
  }
}
