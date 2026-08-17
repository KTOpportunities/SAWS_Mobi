import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if(req.url.includes('/Authenticate/')) return next.handle(req);

    const user = sessionStorage.getItem('CurrentUser'); // 🔥 was 'userData'
   
    
    if(!user) {
      console.warn('No token found in storage');
      return next.handle(req);
    }

    const token = JSON.parse(user).token; // 🔥 your login returns {token: 'eyJ...'}
   
      
    const authReq = req.clone({
      setHeaders: { 
        Authorization: `Bearer ${token}`
      }
    });
      
    return next.handle(authReq);
  }
}