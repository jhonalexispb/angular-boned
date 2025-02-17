import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { LoadingService } from '../../loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from '../../sweetAlert/handleError.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';

@Injectable({
  providedIn: 'root'
})
export class AtributteProductsService {
  sweet:any = new SweetalertService  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  listEscalas(ID_PRODUCTO:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/productos/config_escalas/"+ID_PRODUCTO;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  registerEscala(ID_PRODUCTO:any,data:any){
    this.loadingService.showLoading('Registrando escala')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/productos/config_escalas/"+ID_PRODUCTO;
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  updateEscala(productoId: any, escalaId: any, data: any) {
    this.loadingService.showLoading('Actualizando escala');
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let URL = `${URL_SERVICIO}/atributtes/productos/config_escalas/${productoId}/${escalaId}`;
    return this.http.put(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deleteEscala(productoId: any, escalaId: any){
    this.loadingService.showLoading('Eliminando escala')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/productos/config_escalas/"+productoId+"/"+escalaId;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  updateState(productoId: any, escalaId: any, state:any){
    this.loadingService.showLoading('Actualizando estado de la escala')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = escalaId 
        ? `${URL_SERVICIO}/atributtes/productos/config_escalas/state_escala/${productoId}/${escalaId}`
        : `${URL_SERVICIO}/atributtes/productos/config_escalas/general/state/all_escalas/${productoId}`; 
    return this.http.put(URL,state,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }


  listLotes(ID_PRODUCTO:any){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/productos/config_lotes/"+ID_PRODUCTO;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  registerLotes(ID_PRODUCTO:any,data:any){
    this.loadingService.showLoading('Registrando lote')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/productos/config_lotes/"+ID_PRODUCTO;
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  updateLote(productoId: any, escalaId: any, data: any) {
    this.loadingService.showLoading('Actualizando lote');
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authservice.token});
    let URL = `${URL_SERVICIO}/atributtes/productos/config_lotes/${productoId}/${escalaId}`;
    return this.http.put(URL, data, { headers: headers }).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(() => this.loadingService.hideLoading())
    );
  }

  deleteLote(productoId: any, escalaId: any){
    this.loadingService.showLoading('Eliminando lote')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/atributtes/productos/config_lotes/"+productoId+"/"+escalaId;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  updateStateLote(productoId: any, escalaId: any, state:any){
    this.loadingService.showLoading('Actualizando estado del lote')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = `${URL_SERVICIO}/atributtes/productos/config_lotes/state_escala/${productoId}/${escalaId}`
    return this.http.put(URL,state,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
  
}
