import { URL_SERVICIO } from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerRole(data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }

  listRoles(page = 1, search:string = ''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles?page="+page+"&search="+search;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    ) 
  }

  updateRole(ID_ROLE:string,data:any){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer'+this.authservice.token})
    let URL = URL_SERVICIO+"/roles/"+ID_ROLE;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(()=>this.isLoadingSubject.next(false))
    )
  }
}
