import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent {
  @Input() IMAGE_SELECTED: any;

  rotation: number = 0;  // Ángulo de rotación
  zoomLevel: number = 2; // Nivel de zoom (puedes ajustarlo)
  zoomAreaSize: number = 150; 
  isZooming: boolean = false;
  zoomPosition: string = '0% 0%';

  // Variables para la posición y estilo del área de zoom
  zoomAreaStyle: any = {};
  
  @ViewChild('zoomImage') zoomImage: ElementRef<HTMLImageElement> | undefined;

  constructor(public modal: NgbActiveModal) {}

  // Lógica para rotar la imagen
  rotateImage() {
    this.rotation += 90;  // Incrementa la rotación en 90 grados
    if (this.rotation === 360) {
      this.rotation = 0;  // Resetea la rotación a 0 cuando llega a 360 grados
    }
  }

    onMouseMove(event: MouseEvent) {
      if (!this.isZooming) {
        return;
      }
  
      const image = this.zoomImage?.nativeElement;
      if (!image) return; // Asegurarse de que la imagen esté disponible
      const rect = image.getBoundingClientRect();
      
      // Obtener las coordenadas del mouse dentro de la imagen
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calcular la rotación en radianes
      const radians = this.rotation * (Math.PI / 180);
  
      // Calcular la posición del fondo para el efecto de zoom
      const rotatedX = Math.cos(radians) * (mouseX - rect.width / 2) - Math.sin(radians) * (mouseY - rect.height / 2) + rect.width / 2;
      const rotatedY = Math.sin(radians) * (mouseX - rect.width / 2) + Math.cos(radians) * (mouseY - rect.height / 2) + rect.height / 2;
      
      const correctedX = rect.width - rotatedX;
      const correctedY = rect.height - rotatedY;

      let posX, posY;

      if (this.rotation === 0 || this.rotation === 180) {
        // Usar las posiciones de rotatedX y rotatedY para 0° y 180°
        posX = (rotatedX / rect.width) * 100;
        posY = (rotatedY / rect.height) * 100;
      } else if (this.rotation === 90 || this.rotation === 270) {
        // Usar las posiciones de correctedX y correctedY para 90° y 270°
        posX = (correctedX / rect.width) * 100;
        posY = (correctedY / rect.height) * 100;
      }

      // Ajustar la posición del fondo
      this.zoomPosition = `${posX}% ${posY}%`;

      this.zoomAreaStyle = {
        top: `${mouseY - this.zoomAreaSize / 2}px`, // Centrado en la coordenada Y
        left: `${mouseX - this.zoomAreaSize / 2}px`, // Centrado en la coordenada X
        transform: `rotate(${this.rotation}deg)`
      };
    }

  // Mostrar el área de zoom cuando el mouse entra en la imagen
  onMouseEnter() {
    this.isZooming = true;
  }

  // Ocultar el área de zoom cuando el mouse sale de la imagen
  onMouseLeave() {
    this.isZooming = false;
  }
}

