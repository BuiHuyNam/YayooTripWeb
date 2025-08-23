import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
     FormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  showPassword = false;
  showConfirmPassword = false;

  formData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  };

  errorMsg = '';

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    this.errorMsg = '';
    if (this.formData.password.length < 8) {
      this.errorMsg = 'Mật khẩu phải có tối thiểu 8 ký tự.';
      return;
    }
    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMsg = 'Mật khẩu xác nhận không khớp.';
      return;
    }
    if (!this.formData.agreeToTerms) {
      this.errorMsg = 'Bạn cần đồng ý Điều khoản và Chính sách.';
      return;
    }

    // Handle registration logic here
    console.log('Registration attempt:', this.formData);
  }
}
