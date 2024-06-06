import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordData = {
    email: ''
  };
  showOtp: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit(forgotPasswordForm: NgForm) {
    if (forgotPasswordForm.invalid) {
      Object.keys(forgotPasswordForm.controls).forEach(field => {
        const control = forgotPasswordForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.authService.forgotPassword(this.forgotPasswordData.email).subscribe(success => {
      if (success) {
      }
    });
  }

  onOtpSubmit(forgotPasswordForm: NgForm) {
    if (forgotPasswordForm.invalid) {
      Object.keys(forgotPasswordForm.controls).forEach(field => {
        const control = forgotPasswordForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.authService.forgotPassword(this.forgotPasswordData.email).subscribe(success => {
      if (success) {
      }
    });
  }
}
