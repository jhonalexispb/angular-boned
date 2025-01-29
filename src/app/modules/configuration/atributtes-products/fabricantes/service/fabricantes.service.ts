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
export class FabricantesService {
  constructor(
      private http: HttpClient,
      public authservice: AuthService,
      private loadingService: LoadingService,
      public handleErrorService: HandleErrorService
    ) {}
  
  registerFabricante(data: any) {
    this.loadingService.showLoading('Registrando fabricante');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/fabricante_productos';
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  listFabricantes(page = 1, search: string = '') {
    this.loadingService.showLoading('Listando fabricantes');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL =
      URL_SERVICIO + '/fabricante_productos?page=' + page + '&search=' + search;
    return this.http.get(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => {
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    );
  }

  updateFabricante(ID_FABRICANTE: string, data: any) {
    this.loadingService.showLoading('Actualizando fabricante');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/fabricante_productos/' + ID_FABRICANTE;
    return this.http.post(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deleteFabricante(ID_FABRICANTE: string) {
    this.loadingService.showLoading('Eliminando Fabricante');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/fabricante_productos/' + ID_FABRICANTE;
    return this.http.delete(URL, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  restaurarFabricante(ID_FABRICANTE: string) {
    this.loadingService.showLoading('Restaurando Fabricante');
    let headers = new HttpHeaders({
      Authorization: 'Bearer' + this.authservice.token,
    });
    let URL = URL_SERVICIO + '/fabricante_productos/restaurar/' + ID_FABRICANTE;
    return this.http.put(URL, '', { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  //solicitamos los nombres de paises existentes
  obtenerRecursos(){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/fabricante_productos/recursos/";
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading()),
    )
  }
}
