import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLocalStorageService } from '../../users/service/userLocalStorage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';

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
  sweet:any = new SweetalertService

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public getUserService: UserLocalStorageService,
    public productService: ProductService
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
    this.productService.gestionarProducto(this.PRODUCT_OPTION.id,this.productGestionForm.value).subscribe({
      next: (resp: any) => {
        this.productGestionS.emit(resp);
        this.modal.close();
        this.sweet.success(
          '¡Éxito!',
          'el producto se gestiono correctamente'
        );
      },
    })
  }
}
