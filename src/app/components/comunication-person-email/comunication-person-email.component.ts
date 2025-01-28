import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-person-email',
  templateUrl: './comunication-person-email.component.html',
  styleUrls: ['./comunication-person-email.component.scss']
})
export class ComunicationPersonEmailComponent {
  @Input() EMAIL_SELECTED: {n_datos: number, valor: string, persona: string};
    user:any = ''
  
    constructor(
      public modal: NgbActiveModal,
      public getUserService: UserLocalStorageService,
    ){
    }
  
    ngOnInit(): void {
      this.user = this.getUserService.getUserName()  
    }
}
