import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any;
  constructor(private http: HttpClient) {}

  login(form: any) {
    const body = { UserName: form.username, Password: form.password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<any>(
      `${environment.serverAPI}Authenticate/Login`,
      body,
      httpOptions
    );
  }
  private isLoggedIn = false;

  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  setLoggedInStatus(status: boolean): void {
    this.isLoggedIn = status;
  }
  setUserData(userData: any) {
 
    this.userData = userData;
    console.log('TEST::', this.userData);
  }

  getUserData() {
    return this.userData;
  }
}
