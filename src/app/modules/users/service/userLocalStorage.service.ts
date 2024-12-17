import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLocalStorageService {

  constructor() { }

  // Método para obtener el objeto completo del usuario
  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Método para obtener solo el género del usuario
  getUserGender(): string {
    const user = this.getUser();
    return user.gender || ''; // Si no hay género, retornamos una cadena vacía
  }
}