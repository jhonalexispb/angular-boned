import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { LoadingService } from '../../loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from '../../sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class TransporteOrdenVentaService {

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) { }

  obtenerRazonSocial(ruc:string){
    this.loadingService.showLoading('Solicitando razón social')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/servicio_consulta/get_razon_social?ruc="+ruc;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listTransporteOrdenVenta(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando transportes')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/transporte_orden_venta?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  crear_transporte_orden_venta(data:any){
    this.loadingService.showLoading('Creando transporte')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/transporte_orden_venta"
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  actualizar_transporte_orden_venta(data:any,id:any){
    this.loadingService.showLoading('Actualizando transporte')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/transporte_orden_venta/"+id
    return this.http.put(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  delete_transporte_orden_venta(ID:string){
    this.loadingService.showLoading('Eliminando transporte')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/transporte_orden_venta/"+ID;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
