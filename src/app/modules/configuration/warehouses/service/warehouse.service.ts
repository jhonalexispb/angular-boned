import { LoadingService } from './../../../loadingScreen/loading-screen/service/loading-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIO } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  texto: BehaviorSubject<string>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService: LoadingService
  ) {} 

  registerWarehouse(data:any){
    this.loadingService.showLoading('Registrando almacén')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listWarehouses(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando almacenes')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, 1000);
      })
    ) 
  }

  updateWarehouse(ID_WAREHOUSE:string,data:any){
    this.loadingService.showLoading('Actualizando almacén')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses/"+ID_WAREHOUSE;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteWarehouse(ID_WAREHOUSE:string){
    this.loadingService.showLoading('Eliminando almacén')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/warehouses/"+ID_WAREHOUSE;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
