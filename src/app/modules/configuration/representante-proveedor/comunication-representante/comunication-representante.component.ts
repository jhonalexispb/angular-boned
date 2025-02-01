import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-representante',
  templateUrl: './comunication-representante.component.html',
  styleUrls: ['./comunication-representante.component.scss']
})
export class ComunicationRepresentanteComponent {
  @Input() NUMBER_SELECTED: {valor: string, persona: string};
    user:any = ''
    valor:string = ''
    persona:string = ''
  
    constructor(
      public modal: NgbActiveModal,
      public getUserService: UserLocalStorageService,
    ){
    }
  
    ngOnInit(): void {
      this.user = this.getUserService.getUserName(),  
      this.valor = this.NUMBER_SELECTED.valor,
      this.persona = this.NUMBER_SELECTED.persona
    }
}
