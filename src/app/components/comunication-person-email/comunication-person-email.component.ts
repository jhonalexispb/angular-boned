import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from 'src/app/modules/users/service/userLocalStorage.service';

@Component({
  selector: 'app-comunication-person-email',
  templateUrl: './comunication-person-email.component.html',
  styleUrls: ['./comunication-person-email.component.scss']
})
export class ComunicationPersonEmailComponent {
  @Input() EMAIL_SELECTED: { email: string, name: string, persona: string};
  user:any = ''
  nameRepresentante:string = ''
  email:string = ''
  persona:string = ''

  constructor(
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
  ){
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName()  
    this.nameRepresentante = this.EMAIL_SELECTED.name,
    this.email = this.EMAIL_SELECTED.email
    this.persona = this.EMAIL_SELECTED.persona
  }
}
