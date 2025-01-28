import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-person',
  templateUrl: './comunication-person.component.html',
  styleUrls: ['./comunication-person.component.scss']
})
export class ComunicationPersonComponent {
  @Input() NUMBER_SELECTED: {n_datos: number, valor: string, persona: string};
    user:any = ''
    valor:string = ''
    persona:string = ''
    n_datos:number = 0
  
    constructor(
      public modal: NgbActiveModal,
      public getUserService: UserLocalStorageService,
    ){
    }
  
    ngOnInit(): void {
      this.user = this.getUserService.getUserName(),  
      this.valor = this.NUMBER_SELECTED.valor,
      this.persona = this.NUMBER_SELECTED.persona,
      this.n_datos = this.NUMBER_SELECTED.n_datos
    }
}
