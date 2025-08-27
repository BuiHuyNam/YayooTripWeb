import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

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
  isLoading = false;

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  };

  errorMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

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

    this.isLoading = true;

    // Prepare data for API call
    const registerData = {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        // Redirect to home page or dashboard after successful registration
        alert("Đăng ký thành công!");
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;

        if (error.status === 409) {
          this.errorMsg = 'Email đã tồn tại. Vui lòng sử dụng email khác.';
        } else if (error.status === 400) {
          this.errorMsg = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
        } else if (error.status === 0) {
          this.errorMsg = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
        } else {
          this.errorMsg = 'Đăng ký thất bại. Vui lòng thử lại sau.';
        }
        alert("Đăng ký thất bại. Vui lòng thử lại!");
      }
    });

    // Handle registration logic here
    console.log('Registration attempt:', this.formData);
  }
}
