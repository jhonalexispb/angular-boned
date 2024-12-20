import { ConfigDelay, URL_SERVICIO } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable} from 'rxjs';
import { AuthService } from '../../auth';
import { LoadingService } from '../../loadingScreen/loading-screen/service/loading-service.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  texto: BehaviorSubject<string>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
    private loadingService: LoadingService,
  ) {}

  registerRole(data:any){
    this.loadingService.showLoading('Registrando rol');
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  listRoles(page = 1, search:string = ''){
    this.loadingService.showLoading('Listando roles')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>{
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, ConfigDelay.LOADING_DELAY);
      })
    ) 
  }

  updateRole(ID_ROLE:string,data:any){
    this.loadingService.showLoading('Actualizando rol')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles/"+ID_ROLE;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }

  deleteRole(ID_ROLE:string){
    this.loadingService.showLoading('Eliminando rol')
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles/"+ID_ROLE;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(()=>this.loadingService.hideLoading())
    )
  }
}
