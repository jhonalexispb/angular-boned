import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gestionar-zona-venta',
  templateUrl: './gestionar-zona-venta.component.html',
  styleUrls: ['./gestionar-zona-venta.component.scss']
})
export class GestionarZonaVentaComponent {
  scale: number = 1;  // Variable para controlar el zoom
  zoomFactor: number = 1.2;  // Factor de zoom (puedes ajustarlo)
  vendorsData: any = {};  // Datos de vendedores por distrito
  selectedVendors: any[] = [];  // Vendedores seleccionados por departamento
  departmentName: string = '';  // Nombre del departamento seleccionado

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.loadVendorsData();
    this.addSVGInteractivity();
  }

  // Agregar interactividad al SVG
  addSVGInteractivity(): void {
    const map: any = document.getElementById('peru-map');
  
    map.addEventListener('load', () => {
      const svgDocument = (map as any).contentDocument;  // Acceder al contenido del SVG
      const paths = svgDocument.querySelectorAll('path');
      const svgElement = svgDocument.querySelector('svg');
      const tooltip: any = document.getElementById('tooltip');
      const departmentNameElement: any = document.getElementById('department-name');
  
      svgElement.setAttribute('style', 'background-color: #a0c6f8;');
  
      paths.forEach((path: any) => {
        path.style.fill = '#0066cc';
        path.style.stroke = 'white';
        path.style.strokeWidth = '2';
  
        const departmentTitle = path.getAttribute('title');

        const departmentId = path.getAttribute('id');  // Obtener el id del departamento (ej. "PE-ARE")
        if (this.vendorsData[departmentId]) {
          this.addVendorNamesToDepartment(departmentId, path);
        }
  
        // Evento mouseover
        path.addEventListener('mouseover', (event: any) => {
          event.target.style.fill = '#a0c6f8';
  
          tooltip.style.display = 'block';
          departmentNameElement.textContent = departmentTitle;
  
          const rect = path.getBoundingClientRect();
          const pathCenterX = rect.left + rect.width / 2;
          const pathCenterY = rect.top + rect.height / 2;
  
          tooltip.style.left = `${pathCenterX - tooltip.offsetWidth / 3}px`;
          tooltip.style.top = `${pathCenterY}px`;
        });
  
        // Evento mouseout
        path.addEventListener('mouseout', (event: any) => {
          event.target.style.fill = '#0066cc';
          tooltip.style.display = 'none';
        });
  
        // Evento click
        path.addEventListener('click', (event: any) => {
          const departmentId = path.getAttribute('id');
          console.log(departmentId)
        });
      });
    });
  }

  // Cargar los datos de vendedores (esto puede venir de una API o servicio)
  loadVendorsData(): void {
    this.vendorsData = {
      "PE-ARE": [
        { id: 1, name: "Carlos Pérez", district: "Arequipa City", left: '100px', top: '200px' },
        { id: 2, name: "Ana Gómez", district: "Cayma", left: '200px', top: '250px' }
      ],
      "Lima": [
        { id: 3, name: "José López", district: "Miraflores", left: '50px', top: '300px' },
        { id: 4, name: "Laura Díaz", district: "San Isidro", left: '150px', top: '350px' }
      ]
      // Agrega más departamentos y vendedores según sea necesario
    };
  }

  addVendorNamesToDepartment(departmentId: string, path: any): void {
    const vendors = this.vendorsData[departmentId];
    const vendorElements = document.getElementById('vendor-names-container');

    if (vendorElements) {
      vendors.forEach((vendor: any) => {
        // Crear un div para el nombre del vendedor
        const vendorDiv = document.createElement('div');
        vendorDiv.classList.add('vendor-name');
        vendorDiv.style.position = 'absolute';
        vendorDiv.style.left = vendor.left;
        vendorDiv.style.top = vendor.top;
        vendorDiv.innerHTML = vendor.name;

        // Agregar el nombre del vendedor al contenedor
        vendorElements.appendChild(vendorDiv);
        
        // Establecer el color y tamaño de la fuente, etc., si lo deseas
        vendorDiv.style.fontSize = '12px';
        vendorDiv.style.color = 'black';
      });
    }
  }
}
