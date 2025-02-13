import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-gestionar',
  templateUrl: './modal-gestionar.component.html',
  styleUrls: ['./modal-gestionar.component.scss']
})
export class ModalGestionarComponent {
  @Input() PRODUCT_OPTION:any = [];
  @Output() productGestionS:EventEmitter<any> = new EventEmitter();
  user:any = ''
  productGestionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
  ){
    
  }

  ngOnInit(): void {
    this.user = this.getUserService.getUserName() 
    this.productGestionForm = this.fb.group({
      sale_boleta:[this.PRODUCT_OPTION.sale_boleta,[Validators.required]],
      state:[this.PRODUCT_OPTION.state,[Validators.required]],
      maneja_escalas:[this.PRODUCT_OPTION.maneja_escalas,[Validators.required]],
      promocionable:[this.PRODUCT_OPTION.promocionable,[Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.productGestionForm.value)
    this.modal.close();
  }
}
