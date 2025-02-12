import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class PresentacionesService {
  constructor(
      private http: HttpClient,
      public authservice: AuthService,
      private loadingService: LoadingService,
      public handleErrorService: HandleErrorService
    ) {}
  
  registerPresentacion(data: any) {
    this.loadingService.showLoading('Registrando presentacion');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_presentacion';
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  listPresentaciones(page = 1, search: string = '') {
    this.loadingService.showLoading('Listando presentaciones');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL =
      URL_SERVICIO + '/producto_presentacion?page=' + page + '&search=' + search;
    return this.http.get(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => {
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    );
  }

  updatePresentacion(ID_PRESENTACION: string, data: any) {
    this.loadingService.showLoading('Actualizando presentacion');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_presentacion/'+ID_PRESENTACION;
    return this.http.put(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deletePresentacion(ID_PRESENTACION: string) {
    this.loadingService.showLoading('Eliminando presentacion');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_presentacion/'+ID_PRESENTACION;
    return this.http.delete(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  restaurarPresentacion(ID_PRESENTACION: string) {
    this.loadingService.showLoading('Restaurando presentacion');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_presentacion/restaurar/' + ID_PRESENTACION;
    return this.http.put(URL, '', { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }
}
