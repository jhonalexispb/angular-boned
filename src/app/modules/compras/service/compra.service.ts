import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from '../../auth';
import { LoadingService } from '../../loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from '../../sweetAlert/handleError.service';
import { SweetalertService } from '../../sweetAlert/sweetAlert.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  sweet:any = new SweetalertService  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  listOrdenCompra(page = 1, data:any = null){
    this.loadingService.showLoading('Listando ordenes de compras')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/index?page="+page;
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  updateOrdenCompra(ID_ORDEN_COMPRA:string,data:any){
    this.loadingService.showLoading('Actualizando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/"+ID_ORDEN_COMPRA;
    return this.http.put(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteOrdenCompra(ID_ORDEN_COMPRA:string){
    this.loadingService.showLoading('Eliminando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/"+ID_ORDEN_COMPRA;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerRecursos(){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos";
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  //peticiones para registrar

  registerOrdenCompra(data:any){
    this.loadingService.showLoading('Registrando orden de compra')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //solicitamos el codigo que sigue para el siguiente producto
  obtenerRecursosParaCrear(){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_crear"
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  callProductsByLaboratorio(laboratorioIds: number[]){
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/orden_compra/recursos_crear/productos"
    return this.http.post(URL,{ laboratorio_id: laboratorioIds },{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
