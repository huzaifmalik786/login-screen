import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://dev.platformcommons.org';
  private sessionId: string | null = null;
  private crossSessionId: string | null = null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  login(email: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let loginId = email.split('@@');
    const body = { tenantLogin:loginId[1], password, userLogin: loginId[0] };

    return this.http.post<any>(`${this.url}/gateway/commons-iam-service/api/v1/obo/cross/login?crossTenant=${loginId[1]}`, body, { headers }).pipe(
      map(response => {
        if (response && response.sessionId && response.crossSessionId) {
          this.sessionId = response.sessionId;
          this.crossSessionId = response.crossSessionId;
          return true;
        }
        this.snackBar.open('Invalid login credentials', 'Close', {
          duration: 3000,
        });
        return false;
      }),
      catchError(this.handleError<boolean>('login', false))
    );
  }

  isLoggedIn(): boolean {
    return this.sessionId !== null && this.crossSessionId !== null;
  }

  logout(): void {
    this.sessionId = null;
    this.crossSessionId = null;
  }

  forgotPassword(email: string): Observable<boolean> {
    let loginId = email.split('@@');
    const headers = new HttpHeaders({
        'X-USER': email,
        'tenantName': loginId[1],
      });

    return this.http.get<any>(`${this.url}/gateway/commons-iam-service/api/v1/obo/reset-password?appContext=mad.commons.social`, {headers}).pipe(
      map(response => {
        if(response.errorCode){
            this.snackBar.open('Email does not exist!', 'Close', {
                duration: 3000,
              });
            return false;
        }
        // Assuming a successful response does not return an error
        return true;
      }),
      catchError(this.handleError<boolean>('forgotPassword', false))
    );
  }
  
  sendOtp(email: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.url}/ctld/api/user/selfregistration/v2?tenantLogin=world&emailOrMobile=${email}&name=${email}&appContext=mad.commons.social`, { headers }).pipe(
      map(response => {
        if (response && response.errorCode) {
            this.snackBar.open(response.errorMessage || "An unexpected error has occured.", 'Close', {
                duration: 3000,
              });
          return false;
        }
        return true;
      }),
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${JSON.stringify(error)}`);
      this.snackBar.open('Email does not exist.', 'Close', {
        duration: 3000,
      });
      return of(result as T);
    };
  }
}


