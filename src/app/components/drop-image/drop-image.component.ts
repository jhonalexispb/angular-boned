import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-drop-image',
  templateUrl: './drop-image.component.html',
  styleUrls: ['./drop-image.component.scss']
})
export class DropImageComponent {
  @Input() imageUrl: string | ArrayBuffer | null = null;
  @Output() imageSelected: EventEmitter<File> = new EventEmitter<File>();  // Emitir imagen seleccionada
  @Output() imageDeleted: EventEmitter<void> = new EventEmitter<void>();  // Emitir evento de eliminación

  imageSrc: string | ArrayBuffer | null = null;
  file: File | null = null;  // Para almacenar el archivo de imagen

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && changes['imageUrl'].currentValue) {
      if (this.imageUrl instanceof ArrayBuffer) {
        // Convertir ArrayBuffer a Base64
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([this.imageUrl]));
        reader.onloadend = () => {
          this.imageSrc = reader.result;
        };
      } else {
        this.imageSrc = this.imageUrl;
      }
    }
  }

  // Método para manejar la carga de imagen
  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.file = selectedFile;  // Guardar el archivo
        this.imageSelected.emit(this.file);  // Emitir el archivo al componente padre
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  // Método para manejar la eliminación de la imagen
  deleteImage(event: MouseEvent): void {
    event.stopPropagation();  // Evita que se active el clic en el contenedor
    this.imageSrc = null;     // Elimina la imagen
    this.file = null;         // Elimina el archivo
    this.imageDeleted.emit(); // Emitir evento de eliminación al componente padre
  }
}
