import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  showPassword = false;
  isLoading = false;
  errorMsg = '';

  formData = {
    email: '',
    password: '',
  };


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    // Handle login logic here
    if (!this.formData.email || !this.formData.password) {
      this.errorMsg = 'Vui lòng nhập đầy đủ thông tin.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.formData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        localStorage.setItem('login', response.token);
        console.log(localStorage.getItem('login'))
        // Redirect to home page or dashboard after successful login
        const role = this.authService.getRoles();
        if (role.includes("User")) {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMsg = 'Email hoặc mật khẩu không đúng.';
        } else if (error.status === 0) {
          this.errorMsg = 'Không thể kết nối đến server. Vui lòng thử lại sau.';
        } else {
          this.errorMsg = 'Đăng nhập thất bại. Vui lòng thử lại sau.';
        }
      }
    });
  }
}

