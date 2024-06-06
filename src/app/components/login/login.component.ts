import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  otpSend:boolean = false;
  passwordFieldType: string = 'password';
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(loginForm: NgForm) { 
    if (loginForm.invalid) {
      // Trigger validation messages
      Object.keys(loginForm.controls).forEach(field => {
        const control = loginForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.authService.login(this.loginData.email, this.loginData.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/protected-route']);
      } else {
        this.loginError = 'Invalid login credentials';
      }
    });
  }

  sendOtp(){
  if(!this.loginData.email){
    this.snackBar.open("Please enter a valid email address.", 'Close', {
      duration: 3000,
    });
  }
  else{
    this.authService.sendOtp(this.loginData.email).subscribe({
      next: ()=>{
        this.otpSend = true;
      },
      error: (error: any)=>{
        this.snackBar.open(error.error.errorMessage || "An unexpected error has occured!", 'Close', {
          duration: 3000,
        });
      }
    });
  }
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleOtp() {
    this.otpSend = false;
  }
}
