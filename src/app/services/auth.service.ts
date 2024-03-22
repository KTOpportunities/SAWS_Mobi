import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserLoggedIn } from '../Models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: any;
  private redirectUrl: string | null = null;

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
  private isFromSubscription=false;


  getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }
  getIsFromSubscription(): boolean {
    return this.isFromSubscription;
  }

  setIsFromSubscription(status: boolean): void {
    this.isFromSubscription = status;
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
  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl() {
    return this.redirectUrl;
  }

  saveCurrentUser(user: UserLoggedIn): string {
    sessionStorage.setItem("CurrentUser", JSON.stringify(user));
    // sessionStorage.setItem("token", user.token);
    return "User Saved";
  }

  getCurrentUser() {
    return sessionStorage.getItem("CurrentUser");
  }
}
