import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, throwError } from 'rxjs';
import { AuthService } from '../auth';
import { LoadingService } from '../loadingScreen/loading-screen/service/loading-service.service';
import { SweetalertService } from './sweetAlert.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HandleErrorService {
    private router: Router
    sweet:any = new SweetalertService
   
    private restaurarSubject = new Subject<string>();
    
    constructor(
        private modalService: NgbModal,
        public authservice: AuthService,
        private loadingService:LoadingService
      ) {}

    handleError(error: any) {
        switch (error.status) {
            case 0:
              this.modalService.dismissAll();
              this.loadingService.hideLoading();
              this.sweet.alerta('Ups', 'El servidor no responde, por favor intenta más tarde.','/assets/animations/general/error_default.json');
              break;

            case 401:
              this.modalService.dismissAll();
              this.loadingService.hideLoading();
              this.authservice.logout();
              this.router.navigate(['/login']);
              break;
            
            case 403:
              this.modalService.dismissAll(); 
              this.sweet.alerta('Acceso denegado', 'No tienes permiso para realizar esta acción');
              break;
          
            case 422:
              if (error.error.message) {
                if (error.error.message == 403) {
                  this.sweet.alerta('Ups', error.error.message_text);
                } else {
                  this.sweet.error(error.error.message, error.error.message_text);
                }
              } else {
                const errorMessages = error.error.errors;
                const formattedErrors: { field: string, message: string }[] = [];
          
                // Formatear los errores para enviarlos como parámetros
                for (let field in errorMessages) {
                  errorMessages[field].forEach((message: string) => {
                    formattedErrors.push({ field: field, message: message });
                  });
                }
                this.sweet.errorBackend(error.status, 'Por favor, corrige los siguientes errores de validación:', formattedErrors);
              }
              break;

            case 403:
              this.modalService.dismissAll(); 
              this.sweet.alerta('Acceso denegado', 'No tienes permiso para realizar esta acción');
              break;
          
            default:
                this.modalService.dismissAll();
                this.loadingService.hideLoading();
                this.sweet.alerta('Ups', 'Error interno del servidor. Intenta nuevamente más tarde.','/assets/animations/general/error_400.json');
              break;
        }

        return throwError(() => error); // Rethrow el error
    }

    getRestauracionObservable() {
        return this.restaurarSubject.asObservable();
    }
}
