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
export class CondicionAlmacenamientoService {
  constructor(
      private http: HttpClient,
      public authservice: AuthService,
      private loadingService: LoadingService,
      public handleErrorService: HandleErrorService
    ) {}
  
  registerCondicion(data: any) {
    this.loadingService.showLoading('Registrando condicion de almacenamiento');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/condicion_almacenamiento';
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  listCondiciones(page = 1, search: string = '') {
    this.loadingService.showLoading('Listando condiciones de almacenamiento');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL =
      URL_SERVICIO + '/condicion_almacenamiento?page=' + page + '&search=' + search;
    return this.http.get(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => {
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    );
  }

  updateCondiciones(ID_CONDICION: string, data: any) {
    this.loadingService.showLoading('Actualizando condicion de almacenamiento');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/condicion_almacenamiento/'+ID_CONDICION;
    return this.http.put(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deleteCondicion(ID_CONDICION: string) {
    this.loadingService.showLoading('Eliminando condicion de almacenamiento');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/condicion_almacenamiento/'+ID_CONDICION;
    return this.http.delete(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  restaurarCondicion(ID_CONDICION: string) {
    this.loadingService.showLoading('Restaurando condicion de almacenamiento');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/condicion_almacenamiento/restaurar/' + ID_CONDICION;
    return this.http.put(URL, '', { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }
}
