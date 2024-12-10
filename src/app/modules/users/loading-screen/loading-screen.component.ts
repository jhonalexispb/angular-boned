import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../service/users.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit { 
  isLoading$: Observable<boolean>;
  texto$: Observable<string>;
  constructor(
    private userService: UserService
  ) {}


  ngOnInit(): void {
    this.isLoading$ = this.userService.isLoading$;
    this.texto$ = this.userService.texto.asObservable();
  }
}
