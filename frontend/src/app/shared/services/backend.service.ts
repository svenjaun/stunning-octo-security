import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Member} from '../models/member.model';
import {RegisterRequest} from '../models/registerRequest.model';
import {LoginRequest} from '../models/loginRequest.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private url = 'https://localhost/';

  constructor(private http: HttpClient) {
  }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.url);
  }

  register(questionRequest: RegisterRequest): Observable<string> {
    return this.http.post<string>(this.url + 'register', questionRequest);
  }

  login(loginRequest: LoginRequest): Observable<string> {
    return this.http.post<string>(this.url + 'login', loginRequest);
  }

  grantAdmin(email: string): Observable<string> {
    return this.http.put<string>(this.url + 'admin', { email });
  }

  removeAdmin(email: string): Observable<string> {
    return this.http.delete<string>(this.url + 'admin/' + email);
  }

  getRole(): Observable<string> {
    return this.http.get<string>(this.url + 'role');
  }

  command(command: string): Observable<string> {
    return this.http.post<string>(this.url + 'command', {command});
  }

}
