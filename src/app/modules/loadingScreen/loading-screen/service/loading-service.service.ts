// loading.service.ts (nuevo servicio global)
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private textoSubject = new BehaviorSubject<string>('');
  texto$ = this.textoSubject.asObservable();

  private animationSubject = new BehaviorSubject<string>('');
  animation$ = this.animationSubject.asObservable();

  constructor() {}

  // Método para activar la carga y mostrar el texto
  showLoading(texto: string, image: string = '/assets/animations/general/pantalla_de_carga.json') {
    this.isLoadingSubject.next(true);
    this.textoSubject.next(texto);
    this.animationSubject.next(image);
  }

  // Método para desactivar la carga
  hideLoading() {
    this.isLoadingSubject.next(false);
    this.textoSubject.next('');
    this.animationSubject.next('');
  }
}
