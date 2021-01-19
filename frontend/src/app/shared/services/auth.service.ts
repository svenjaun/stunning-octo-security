import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/loginRequest.model';
import { BackendService } from './backend.service';
import { RegisterRequest } from '../models/registerRequest.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private backendService: BackendService) {
  }

  messageSubject: Subject<boolean> = new Subject<boolean>();

  sendMessage(): void {
    this.messageSubject.next(null);
  }

  getIdToken(): string {
    return localStorage.getItem('id_token');
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('id_token') ? true : false;
  }

  login(loginRequest: LoginRequest): void {
    this.backendService.login(loginRequest).subscribe((res) => {
      this.sendMessage();
      localStorage.setItem('id_token', res['token']);
    });
  }

  logout() {
    localStorage.removeItem('id_token');
  }


  register(registerRequest: RegisterRequest): void {
    this.backendService.register(registerRequest).subscribe(() => {
      const loginRequest = new LoginRequest();
      loginRequest.username = registerRequest.username;
      loginRequest.password = registerRequest.password;
      this.login(loginRequest);
    });
  }
}
