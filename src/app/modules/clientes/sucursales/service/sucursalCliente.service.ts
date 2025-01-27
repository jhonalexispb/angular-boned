import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';
import { SweetalertService } from 'src/app/modules/sweetAlert/sweetAlert.service';

@Injectable({
  providedIn: 'root'
})
export class SucursalClienteService {
  sweet:any = new SweetalertService  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService:LoadingService,
    public handleErrorService: HandleErrorService,
  ) {}

  registerSucursalCliente(data:any){
    this.loadingService.showLoading('Registrando sucursal')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal";
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listSucursalCliente(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando sucursales')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  updateSucursalCliente(ID_SUCURSAL:string,data:any){
    this.loadingService.showLoading('Actualizando sucursal')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal/"+ID_SUCURSAL;
    return this.http.post(URL,data,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteSucursalCliente(ID_SUCURSAL:string){
    this.loadingService.showLoading('Eliminando sucursal')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal/"+ID_SUCURSAL;
    return this.http.delete(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  restaurarSucursalCliente(ID_SUCURSAL:string){
    this.loadingService.showLoading('Restaurando sucursal')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal/restaurar/"+ID_SUCURSAL;
    return this.http.put(URL,'',{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //solicitamos los distritos/provincia/departamentos, y categorias
  obtenerRecursosParaCrear(){
    this.loadingService.showLoading('Solicitando recursos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal/recursos/";
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  obtenerRecursosParaEditar(ID_SUCURSAL:string){
    this.loadingService.showLoading('Solicitando recursos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal/recursos/"+ID_SUCURSAL;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //solicitamos la razon social del ruc en el backend
  obtenerRazonSocial(ruc:any){
    this.loadingService.showLoading('Solicitando razón social')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/servicio_consulta/get_razon_social?ruc="+ruc;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //solicitamos el nombre de un DNI en el backend
  obtenerNombrePorDni(dni:any){
    this.loadingService.showLoading('Solicitando el nombre de la persona')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/servicio_consulta/get_nombre_por_dni?dni="+dni;
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  //solicitamos el nombre de un DNI en el backend
  obtenerRecursosParaGestionar(ID_SUCURSAL:string){
    this.loadingService.showLoading('Solicitando recursos')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/cliente_sucursal/recursos/gestion_cliente/"+ID_SUCURSAL
    return this.http.get(URL,{headers: headers}).pipe(
      catchError((error) => this.handleErrorService.handleError(error)),
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
