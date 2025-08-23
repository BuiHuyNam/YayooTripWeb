import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  formData = {
    email: '',
    password: '',
  };

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', this.formData);
  }
}

