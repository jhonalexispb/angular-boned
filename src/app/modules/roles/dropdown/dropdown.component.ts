import { Component, ElementRef, HostListener} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditRolesComponent } from '../edit-roles/edit-roles.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  menuVisible = false;

  constructor(
    public modalService: NgbModal,
    private el: ElementRef
  ) {}

  // Método para alternar la visibilidad del menú
  toggleMenu(event: MouseEvent): void {
    event.preventDefault();
    this.menuVisible = !this.menuVisible; // Alternar la visibilidad
  }

  // Escuchar clics fuera del componente usando HostListener
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      // Si el clic es fuera del componente, cerrar el menú
      this.menuVisible = false;
    }
  }



  editRole(ROL:any){
    const modalRef = this.modalService.open(EditRolesComponent,{centered:true, size: 'md'})

    modalRef.componentInstance.ROLE_SELECTED = ROL;

    //OBTENEMOS EL OUTPUT DEL COMPONENTE HIJO EDITAR
    /* modalRef.componentInstance.RoleE.subscribe((role:any)=>{
      let INDEX = this.ROLES.findIndex((rol:any) => rol.id == ROL.id);
      if(INDEX != -1){
        this.ROLES[INDEX] = role
      }
    }) */
  }
}
