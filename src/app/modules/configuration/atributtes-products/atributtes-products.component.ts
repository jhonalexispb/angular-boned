import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-atributtes-products',
  templateUrl: './atributtes-products.component.html',
  styleUrls: ['./atributtes-products.component.scss']
})
export class AtributtesProductsComponent {
  isMenuCollapsed = false;  // Variable para controlar la visibilidad del menú
  selectedSection: string = ''; 

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.setSelectedSectionFromRoute();
  }

  setSelectedSectionFromRoute() {
    // Obtén la primera ruta hija activa (ruta anidada)
    const currentRoute = this.route.snapshot.firstChild?.url[0]?.path;
    if (currentRoute) {
      this.selectedSection = this.getSectionFromRoute(currentRoute);
    }
  }

  getSectionFromRoute(route: string): string {
    switch(route) {
      case 'laboratorios':
        return 'Laboratorios';
      case 'principios-activos':
        return 'Principios Activos';
      case 'categorias':
        return 'Categorias';
      case 'fabricantes-productos':
        return 'Fabricantes';
      case 'lineas-farmaceuticas':
        return 'Lineas Farmaceuticas';
      case 'presentaciones':
        return 'Presentaciones';
      case 'condiciones-almacenamiento':
        return 'Condiciones Almacenamiento';
      default:
        return 'Laboratorios'; // Por defecto
    }
  }

  setSelectedSection(section: string) {
    this.selectedSection = section;
    this.isMenuCollapsed = false;
  }

  getIconForSection(section: string): string {
    switch(section) {
      case 'Laboratorios':
        return 'fas fa-flask'; // Icono de Laboratorio
      case 'Principios Activos':
        return 'fas fa-capsules'; // Icono de Principios Activos
      case 'Categorias':
        return 'fas fa-tags'; // Icono de Categorías
      case 'Fabricantes':
        return 'fas fa-industry'; // Icono de Fabricantes
      case 'Lineas Farmaceuticas':
        return 'fas fa-pills'; // Icono de Líneas Farmacéuticas
      case 'Presentaciones':
        return 'fas fa-box';
      case 'Condiciones Almacenamiento':
        return 'fas fa-temperature-low';
      default:
        return 'fas fa-question'; // Ícono por defecto
    }
  }
}
