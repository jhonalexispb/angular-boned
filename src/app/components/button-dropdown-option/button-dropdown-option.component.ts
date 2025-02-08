import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-button-dropdown-option',
  templateUrl: './button-dropdown-option.component.html',
  styleUrls: ['./button-dropdown-option.component.scss']
})
export class ButtonDropdownOptionComponent {
  activeDropdown: boolean = false;  // Índice del dropdown activo

  toggleButtonsVisibility() {
    this.activeDropdown = !this.activeDropdown
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.dropdown');
    if (!clickedInside) {
      this.activeDropdown = false; 
    }
  }
}
