import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, catchError } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriasServiceService {

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService: LoadingService,
    public handleErrorService: HandleErrorService
  ) {}

  registerCategoria(data: any) {
    this.loadingService.showLoading('Registrando categoria');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_categoria';
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  listCategorias(page = 1, search: string = '') {
    this.loadingService.showLoading('Listando categorias');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL =
      URL_SERVICIO + '/producto_categoria?page=' + page + '&search=' + search;
    return this.http.get(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => {
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    );
  }

  updateCategoria(ID_CATEGORIA: string, data: any) {
    this.loadingService.showLoading('Actualizando categoria');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_categoria/' + ID_CATEGORIA;
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deleteCategoria(ID_CATEGORIA: string) {
    this.loadingService.showLoading('Eliminando categoria');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_categoria/' + ID_CATEGORIA;
    return this.http.delete(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  restaurarCategoria(ID_CATEGORIA: string) {
    this.loadingService.showLoading('Restaurando categoria');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/producto_categoria/restaurar/' + ID_CATEGORIA;
    return this.http.put(URL, '', { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }
}
