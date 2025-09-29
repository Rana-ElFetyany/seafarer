import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { TokenResponse } from '../interfaces/token-response';
import { baseUrl } from '../environments/environment'; // ✅ استدعاء الـ baseUrl

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${baseUrl}/token`;

  login(user: {
    username: string;
    password: string;
    mobileid: string;
  }): Observable<TokenResponse> {
    const body = new URLSearchParams();
    body.set('username', user.username);
    body.set('Password', user.password);
    body.set('grant_type', 'password');
    body.set('mobileid', user.mobileid);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http
      .post<TokenResponse>(this.apiUrl, body.toString(), { headers })
      .pipe(
        tap((res) => {
          if (res && res.access_token) {
            localStorage.setItem('token', res.access_token);
          }
        })
      );
  }
}
