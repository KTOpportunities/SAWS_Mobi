import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if(req.url.includes('/Authenticate/')) return next.handle(req);

    const user = sessionStorage.getItem('CurrentUser'); // 🔥 was 'userData'
    console.log('RAW STORAGE:', user);
    
    if(!user) {
      console.warn('No token found in storage');
      return next.handle(req);
    }

    const token = JSON.parse(user).token; // 🔥 your login returns {token: 'eyJ...'}
    console.log('TOKEN:', token?.substring(0,20));
      
    const authReq = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`
      }
    });
      
    return next.handle(authReq);
  }
}