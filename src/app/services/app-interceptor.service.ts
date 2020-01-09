import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AppInterceptorService implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(
                // this.handleError
                (error: HttpErrorResponse) => {
                    console.log(error);
                    console.log(this.router);
                    if (error.status === 401) {
                        window.localStorage.clear();
                        // window.location.href = 'http://localhost:8888/refresh';
                        this.router.navigate(['/login']);
                    }
                    return throwError(error);
                }
            )
        );
    }

    // handleError(error: HttpErrorResponse) {
    //   console.log(error);
    //   console.log(this.router);
    //   if (error.status === 401) {
    //     window.localStorage.clear();
    //     this.router.navigate(['/login']);
    //   }
    //   return throwError(error);
    // }
}
