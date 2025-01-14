import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize, catchError } from 'rxjs';
import { URL_SERVICIO, ConfigDelay } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';
import { LoadingService } from 'src/app/modules/loadingScreen/loading-screen/service/loading-service.service';
import { HandleErrorService } from 'src/app/modules/sweetAlert/handleError.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceProveedorService {
  isLoading$: Observable<boolean>;
      isLoadingSubject: BehaviorSubject<boolean>;
      texto: BehaviorSubject<string>;
      
      constructor(
        private http: HttpClient,
        public authservice: AuthService,
        private loadingService:LoadingService,
        public handleErrorService: HandleErrorService,
      ) {}
    
      registerProveedor(data:any){
        this.loadingService.showLoading('Registrando proveedor')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/proveedor";
        return this.http.post(URL,data,{headers: headers}).pipe(
          catchError((error) => this.handleErrorService.handleError(error)),
          finalize(()=>this.loadingService.hideLoading())
        )
      }
    
      listProveedor(page = 1, search:string = ''){
        this.loadingService.showLoading('Listando proveedores')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/proveedor?page="+page+"&search="+search;
        return this.http.get(URL,{headers: headers}).pipe(
          catchError((error) => this.handleErrorService.handleError(error)),
          finalize(()=>{
            setTimeout(() => {
              this.loadingService.hideLoading();
            }, ConfigDelay.LOADING_DELAY);
          })
        ) 
      }
    
      updateProveedor(ID_PROVEEDOR:string,data:any){
        this.loadingService.showLoading('Actualizando proveedor')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/proveedor/"+ID_PROVEEDOR;
        return this.http.put(URL,data,{headers: headers}).pipe(
          catchError((error) => this.handleErrorService.handleError(error)),
          finalize(()=>this.loadingService.hideLoading())
        )
      }
    
      deleteProveedor(ID_PROVEEDOR:string){
        this.loadingService.showLoading('Eliminando Proveedor')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/proveedor/"+ID_PROVEEDOR;
        return this.http.delete(URL,{headers: headers}).pipe(
          catchError((error) => this.handleErrorService.handleError(error)),
          finalize(()=>this.loadingService.hideLoading())
        )
      }
  
      restaurarProveedor(ID_PROVEEDOR:string){
        this.loadingService.showLoading('Restaurando proveedor')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/proveedor/restaurar/"+ID_PROVEEDOR;
        return this.http.put(URL,'',{headers: headers}).pipe(
          catchError((error) => this.handleErrorService.handleError(error)),
          finalize(()=>this.loadingService.hideLoading())
        )
      }

      //solicitamos los distritos y representantes de venta
      obtenerRecursos(){
        this.loadingService.showLoading('Solicitando recursos')
        let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
        let URL = URL_SERVICIO+"/proveedor/recursos/";
        return this.http.get(URL,{headers: headers}).pipe(
          catchError((error) => this.handleErrorService.handleError(error)),
          finalize(()=>this.loadingService.hideLoading())
        )
      }
}
