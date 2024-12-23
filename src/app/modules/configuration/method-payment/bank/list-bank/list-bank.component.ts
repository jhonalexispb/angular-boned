import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';
import { BankService } from '../service/bank-service.service';
import { EditBankComponent } from '../edit-bank/edit-bank.component';
import { CreateBankComponent } from '../create-bank/create-bank.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: ['./list-bank.component.scss']
})
export class ListBankComponent {
  search:string = '';
  BANCOS:any = [];
  isLoading$:any;
  sweet:any = new SweetalertService


  totalPages:number = 0; 
  currentPage:number = 1;
  
  page = 1;
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;

    this.currentPage = this.page;
    this.loadPage(this.page);
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  constructor(
    public modalService: NgbModal,
    public bankService: BankService,
  ){

  }

  ngOnInit(): void {
    this.isLoading$ = this.bankService.isLoading$;
    this.listBancos();
  }

  listBancos(page = 1){
    this.bankService.listBancos(page,this.search).subscribe((resp: any) => {
      this.BANCOS = resp.bank;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listBancos($event);
  }

  editBank(BANK:any){
    const modalRef = this.modalService.open(EditBankComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.BANK_SELECTED = BANK;
    modalRef.componentInstance.BankE.subscribe((bank:any)=>{
      let INDEX = this.BANCOS.findIndex((b:any) => b.id == BANK.id);
      if(INDEX != -1){
        this.BANCOS[INDEX] = bank
      }
    })
  }

  createBank(){
    const modalRef = this.modalService.open(CreateBankComponent,{centered:true, size: 'md'})
    modalRef.componentInstance.BancoC.subscribe((bank:any)=>{
      this.BANCOS.unshift(bank); //integra el nuevo valor al inicio de la tabla
    })
  }

  deleteBank(BANCO:any){
    this.sweet.confirmar_borrado('¿Estás seguro?', `¿Deseas eliminar el banco: ${BANCO.name}?`).then((result:any) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer la llamada al servicio para eliminar el rol
        this.bankService.deleteBanco(BANCO.id).subscribe({
          next: (resp: any) => {
            if (resp.message === 403) {
              this.sweet.error('Error', resp.message_text);
            } else {
              this.BANCOS = this.BANCOS.filter((b:any) => b.id !== BANCO.id); // Eliminamos el rol de la lista
              this.sweet.success('Eliminado', 'El banco ha sido eliminado correctamente');
            }
          },
          error: (error) => {
            this.sweet.error(error.status);
          }
        })
      }
    });
  }
}
