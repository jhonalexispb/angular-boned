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
export class LineasFarmaceuticasService {
  constructor(
      private http: HttpClient,
      public authservice: AuthService,
      private loadingService: LoadingService,
      public handleErrorService: HandleErrorService
    ) {}
  
  registerLineaFarmaceutica(data: any) {
    this.loadingService.showLoading('Registrando linea farmaceutica');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/lineas_farmaceuticas';
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  listLineasFarmaceuticas(page = 1, search: string = '') {
    this.loadingService.showLoading('Listando lineas farmaceuticas');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL =
      URL_SERVICIO + '/lineas_farmaceuticas?page=' + page + '&search=' + search;
    return this.http.get(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => {
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    );
  }

  updateLineaFarmaceutica(ID_LINEA_FARMACEUTICA: string, data: any) {
    this.loadingService.showLoading('Actualizando linea farmaceutica');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/lineas_farmaceuticas/' + ID_LINEA_FARMACEUTICA;
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deleteLineaFarmaceutica(ID_LINEA_FARMACEUTICA: string) {
    this.loadingService.showLoading('Eliminando linea farmaceutica');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/lineas_farmaceuticas/' + ID_LINEA_FARMACEUTICA;
    return this.http.delete(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  restaurarLineaFarmaceutica(ID_LINEA_FARMACEUTICA: string) {
    this.loadingService.showLoading('Restaurando linea farmaceutica');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/lineas_farmaceuticas/restaurar/' + ID_LINEA_FARMACEUTICA;
    return this.http.put(URL, '', { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }
}
