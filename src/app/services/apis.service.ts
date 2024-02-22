import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  User: any;
  token: any;
  constructor(private http: HttpClient) {
    var stringUser = sessionStorage.getItem('User');
    if (stringUser) {
      this.User = JSON.parse(stringUser);
      this.token = this.User.DetailDescription.token;
    }
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  createNewUser(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'Authenticate/RegisterSubscriber',
      body
    );
  }

  RequestPasswordReset(form: any) {
    return this.http
      .post<any>(
        environment.serverAPI +
          `Authenticate/RequestPasswordReset?email=${form.Email}`,
        form
      )
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  PostInsertNewFeedback(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'Feedback/PostInsertNewFeedback',
      body
    );
  }

}
