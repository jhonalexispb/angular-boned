import { Component, OnInit } from '@angular/core';
import { RolesService } from '../service/roles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit { 
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  constructor(
    private rolesService: RolesService
  ) {}


  ngOnInit(): void {
    this.isLoading$ = this.rolesService.isLoading$;
    this.texto$ = this.rolesService.texto.asObservable();
  }
}
