import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, catchError, BehaviorSubject } from 'rxjs';
import { CredentialsDetails } from '../Models/credential';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  User: any;
  token: any;
  private feedbackSubject = new BehaviorSubject<any | null>(null);
  public feedbackObservable$ = this.feedbackSubject.asObservable();

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
  
    }),
  };

  createNewUser(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Authenticate/RegisterSubscriber',
      body
    );
  }

  sendCredentials(body: CredentialsDetails) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Authenticate/SendCredentials',
      body
    );
  }

  setFeedbackData(data: any): void {
    this.feedbackSubject.next(data);
  }

  RequestPasswordReset(form: any) {
    return this.http
      .post<any>(
        environment.serverAPI +
          `v1/Authenticate/RequestPasswordReset?email=${form.Email}`,
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
      environment.serverAPI + 'v1/Feedbacks/PostInsertNewFeedback',
      body
    );
  }

  getPagedAllSubscribers(pageNumber: any, pageSize: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Feedbacks/GetPagedAllFeedbacks?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getFeedbackById(id: number) {
    return this.http.get<any>(
      environment.serverAPI + `v1/Feedbacks/GetFeedbackById?Id=${id}`
    );
  }

  getFeedbackMessagesBySenderId(senderId: string) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Feedbacks/GetFeedbackMessagesBySenderId?Id=${senderId}`
    );
  }

  PostDocsForFeedback(formData: any) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/FileManager/PostDocsForFeedback',
      formData
    );
  }

  getAdvertByAdvertId(id: number) {
    return this.http.get<any>(
      environment.serverAPI + `v1/Adverts/GetAdvertByAdvertId?id=${id}`
    );
  }

  getAllAdverts() {
    return this.http.get<any>(
      environment.serverAPI + `v1/Adverts/GetAllAdverts`
    );
  }

  getDocAdvertFileById(id: any) {
    return this.http.get(
      environment.serverAPI + `v1/FileManager/GetDocAdvertFileById?Id=${id}`,
      { responseType: 'blob' }
    );
  }

  postInsertNewFeedback(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Feedbacks/PostInsertNewFeedback',
      body
    );
  }

  PostInsertAdvertClick(body: {}) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Adverts/PostInsertAdvertClick',
      body
    );
  }

  paySubscription(body: any) {
    console.log('Subscribe: ', body);
    return this.http.post<any>(
      environment.serverAPI + 'v1/Subscriptions/RecurringPayment',
      body
    );
  }

  GetSourceTextFolderFiles(foldername: string) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceTextFolderFiles?foldername=${foldername}`
    );
  }

  GetSourceTextFolderFilesTime(foldername: string, time: any) {
    const url = `${environment.serverAPI}v1/RawSource/GetSourceTextFolderFiles`;

    // Construct the query parameters including foldername and lasthours
    const queryParams = {
      foldername: foldername,
    };

    // Make the HTTP GET request with query parameters
    return this.http.get<any>(url, { params: queryParams });
  }

  GetSourceChartFolderFilesList(foldername: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceChartFolderFilesList?foldername=${foldername}`
    );
  }

  GetSourceChartFolderFilesListtime(foldername: any, time: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceChartFolderFilesList?imagefoldername=${foldername}`
    );
  }

  GetSourceAviationFolderFilesList(foldername: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceAviationFolderFilesList?foldername=${foldername}`
    );
  }

  GetSourceAviationFolderFilesListNull() {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceAviationFolderFilesList?imagefoldername=`
    );
  }

  GetAviationFile(
    imagefoldername: string,
    imagefilename: string
  ): Observable<any> {
    const url = `${environment.serverAPI}v1/RawSource/GetAviationFile?imagefoldername=${imagefoldername}&imagefilename=${imagefilename}`;
    return this.http.get<any>(url);
  }

  GetChartsFile(
    imagefoldername: string,
    imagefilename: string
  ): Observable<any> {
    const url = `${environment.serverAPI}v1/RawSource/GetChartsFile?imagefoldername=${imagefoldername}&imagefilename=${imagefilename}`;
    return this.http.get<any>(url);
  }

  getFileType(fileMimetype: string): string {
    const videoMimeTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
    ];
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/jpg',
      'image/svg+xml',
    ];
    const applicationMimeTypes = ['application/pdf'];
    const audioMimeTypes = [
      'audio/mpeg',
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
      'audio/mp3',
    ];

    if (videoMimeTypes.includes(fileMimetype)) {
      return 'Video';
    } else if (imageMimeTypes.includes(fileMimetype)) {
      return 'Image';
    } else if (applicationMimeTypes.includes(fileMimetype)) {
      return 'Application';
    } else if (audioMimeTypes.includes(fileMimetype)) {
      return 'Audio';
    } else {
      return 'Unknown';
    }
  }

  getFeedbackData(): Observable<any> {
    return this.feedbackObservable$;
  }

  PostInsertSubscription(body: any) {
    return this.http.post<any>(
      environment.serverAPI + 'v1/Subscriptions/PostInsertSubscription',
      body
    );
  }

  CancelSubscription(subscriptionId: number) {
    const body = {
      subscriptionId: subscriptionId,
    };

    return this.http.post<any>(
      environment.serverAPI +
        `v1/Subscriptions/CancelSubscription?subscriptionId=${subscriptionId}`,
      body
    );
  }

  GetSubscriptionByUserProfileId(Id: number) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/Subscriptions/GetActiveSubscriptionByUserProfileId?Id=${Id}`
    );
  }

 GetActiveSubscriptionByUserProfileId(id: number) {
  return this.http.get<any>(
    environment.serverAPI + `v1/Subscriptions/GetActiveSubscriptionByUserProfileId?Id=${id}`
  );
}

  getSpeciReport(): Observable<any> {
    return this.http.get<any>(
      environment.serverAPI +
        'v1/RawSource/GetSourceTextFolderFiles?foldername=speci'
    );
  }

  getRecentTafs(foldername: string): Observable<any> {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceTextFolderFiles?foldername=${foldername}`
    );
  }
  getRecentTafsTime(foldername: string, time: any): Observable<any> {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceTextFolderFiles?foldername=${foldername}`
    );
  }

  getMetarReports(foldername: any, limits: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceTextFolderFiles?foldername=${foldername}&limit=${limits}`
    );
  }
  getRecentMetarReports(foldername: any, time: any) {
    return this.http.get<any>(
      environment.serverAPI +
        `v1/RawSource/GetSourceAviationFolderFilesList?imagefoldername=${foldername}`
    );
  }

  fetchWindChartImages(foldername: any): Observable<any[]> {
    const apiUrl = `${environment.serverAPI}v1/RawSource/GetSourceAviationFolderFilesList`;

    // Construct the query parameters including foldername and lasthours
    const queryParams = {
      imagefoldername: foldername,
    };

    // Make the HTTP GET request with query parameters
    return this.http.get<any[]>(apiUrl, { params: queryParams });
  }

  fetchHourlyChartData(foldername: any): Observable<any[]> {
    const apiUrl = `${environment.serverAPI}v1/RawSource/GetSourceAviationFolderFilesList`;
    const queryParams = {
      imagefoldername: foldername,
    };
    return this.http.get<any[]>(apiUrl, { params: queryParams });
  }

  getFlightTemplates() {
  return this.http.get<any>(
    environment.serverAPI + 'v1/FlightTemplate'
  );
}

createFlightTemplate(body: any) {
  return this.http.post<any>(
    environment.serverAPI + 'v1/FlightTemplate',
    body
  );
}

deleteFlightTemplate(id: number) {
  return this.http.delete<any>(
    environment.serverAPI + `v1/FlightTemplate/${id}`
  );
}


  
  saveOperationalSettings(data: any) {
  return this.http.post(
    environment.serverAPI + 'v1/OperationalSettings',
    data
  );
}

getOperationalSettings() {
  return this.http.get(
    environment.serverAPI + `v1/OperationalSettings`,
  );
}
}
