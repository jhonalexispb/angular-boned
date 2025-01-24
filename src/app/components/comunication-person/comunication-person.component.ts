import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-person',
  templateUrl: './comunication-person.component.html',
  styleUrls: ['./comunication-person.component.scss']
})
export class ComunicationPersonComponent {
  @Input() NUMBER_SELECTED: { phone: string, name: string, persona: string};
    user:any = ''
    nameRepresentante:string = ''
    phone:string = ''
    persona:string = ''
  
    constructor(
      public modal: NgbActiveModal,
      public getUserService: UserLocalStorageService,
    ){
    }
  
    ngOnInit(): void {
      this.user = this.getUserService.getUserName()  
      this.nameRepresentante = this.NUMBER_SELECTED.name,
      this.phone = this.NUMBER_SELECTED.phone
      this.persona = this.NUMBER_SELECTED.persona
    }
}
