import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError } from 'rxjs';

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
  getPagedAllSubscribers(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `Feedback/GetPagedAllFeedbacks?pageNumber=${pageNumber}&pageSize=${pageSize}`
      // {
      //   headers: new HttpHeaders().append(
      //     'Authorization',
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }
  getFeedbackById(id: number) {
    return this.http.get<any>(
      environment.serverAPI + `Feedback/GetFeedbackById?Id=${id}`
    );
  }
  getFeedbackMessagesBySenderId(senderId: string) {
    return this.http.get<any>(
      environment.serverAPI +
        `Feedback/GetFeedbackMessagesBySenderId?Id=${senderId}`
    );
  }

  // Method to fetch advertisement by ID
  getAdvertByAdvertId(id: number) {
    return this.http.get<any>(
      environment.serverAPI + `Advert/GetAdvertByAdvertId?id=${id}`
    );
  }

  // Method to fetch all advertisements
  getAllAdverts() {
    return this.http.get<any>(environment.serverAPI + `Advert/GetAllAdverts`);
  }

  // getDocAdvertFileById(id: number) {
  //   return this.http.get<any>(
  //     environment.serverAPI +`FileManager/GetDocAdvertFileById?Id=${id}`

  //   );
  // }
  // GetAdvertByAdvertId(id: any): Observable<any> {
  //   return this.http.get<any>(`${environment.serverAPI}Advert/GetAdvertByAdvertId?Id=${id}`);
  // }

  getDocAdvertFileById(id: any) {
    return this.http.get(
      environment.serverAPI + `FileManager/GetDocAdvertFileById?Id=${id}`,
      { responseType: 'blob' }
    );
  }
  postInsertNewFeedback(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'Feedback/PostInsertNewFeedback',
      body
      // this.httpOptions
      // {
      //   headers: new HttpHeaders().append(
      //     "Authorization",
      //     `Bearer ${this.token}`
      //   ),
      // }
    );
  }

  paySubscription(body: any) {
    console.log('Subscribe: ', body);
    // debugger;
    return this.http.post<any>(
      environment.serverAPI + 'Subscriber/MakeRecurringPayment',
      body
    );
  }

  GetSourceTextFolderFiles(foldername:string) {
    return this.http.get<any>(
      environment.serverAPI + `RawSource/GetSourceTextFolderFiles?textfoldername=${foldername}`
    );
  }

  getFileType(fileMimetype: string): string {
    const videoMimeTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"];
    const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/jpg", "image/svg+xml"];
    const applicationMimeTypes = ["application/pdf"];
    const audioMimeTypes = ["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav",  "audio/mp3"];

    if (videoMimeTypes.includes(fileMimetype)) {
      return "Video";
    } else if (imageMimeTypes.includes(fileMimetype)) {
      return "Image";
    } else if (applicationMimeTypes.includes(fileMimetype)) {
      return "Application";
    } else if (audioMimeTypes.includes(fileMimetype)) {
      return "Audio";
    } else {
      return "Unknown";
    }
  }
}
