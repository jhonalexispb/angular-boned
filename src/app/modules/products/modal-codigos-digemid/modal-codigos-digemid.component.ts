import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';

@Component({
  selector: 'app-modal-codigos-digemid',
  templateUrl: './modal-codigos-digemid.component.html',
  styleUrls: ['./modal-codigos-digemid.component.scss']
})
export class ModalCodigosDigemidComponent {
  @Input() CODIGOS_LIST:any = [];
  @Output() CodigoS:EventEmitter<any> = new EventEmitter();
  user:any = ''

  constructor(
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
  ){
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName() 
  }

  seleccionarCodigo(codigo: string) {
    this.CodigoS.emit(codigo);
    this.modal.close();
  }
}
