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
        // Manejar el error 401 (No autorizado
        if (error.status === 401) {
        this.modalService.dismissAll();
        this.loadingService.hideLoading();
        this.authservice.logout();
        this.router.navigate(['/login']);
        } else if (error.status === 403) {
        this.modalService.dismissAll(); 
        this.sweet.alerta('Acceso denegado', 'No tienes permiso para realizar esta acción');
        } else if (error.status === 422) {
        if(error.error.message){
            if (error.error.message == 403) {
            this.sweet.alerta('Ups', error.error.message_text);
            } else{
            this.sweet.error(error.error.message,error.error.message_text);
            }
        }else{
            const errorMessages = error.error.errors;
            const formattedErrors: { field: string, message: string }[] = [];

            // Formatear los errores para enviarlos como parámetros
            for (let field in errorMessages) {
            errorMessages[field].forEach((message: string) => {
                formattedErrors.push({ field: field, message: message });
            });
            }
            this.sweet.errorBackend(error.status,'Por favor, corrige los siguientes errores de validación:' ,formattedErrors);
        }
        }

        return throwError(() => error); // Rethrow el error
    }

    getRestauracionObservable() {
        return this.restaurarSubject.asObservable();
    }
}
