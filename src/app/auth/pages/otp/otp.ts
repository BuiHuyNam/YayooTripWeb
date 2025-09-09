import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-otp',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './otp.html',
    styleUrl: './otp.css'
})
export class OtpComponent {
    isSubmitting = false;
    errorMsg = '';
    otp = '';

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    submitOtp(e: Event) {
        e.preventDefault();
        this.errorMsg = '';

        const trimmed = (this.otp || '').trim();
        if (trimmed.length === 0) {
            this.errorMsg = 'Vui lòng nhập mã OTP.';
            return;
        }

        this.isSubmitting = true;
        this.authService.verifyOtp({ email: localStorage.getItem('email') || '', otp: trimmed }).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                Swal.fire({ title: 'Xác minh OTP thành công!', icon: 'success', timer: 1500 });
                this.router.navigate(['/auth/login']);
            },
            error: (err) => {
                this.isSubmitting = false;
                if (err?.status === 400) this.errorMsg = 'Mã OTP không hợp lệ hoặc đã hết hạn.';
                else this.errorMsg = 'Xác minh OTP thất bại. Vui lòng thử lại.';
                Swal.fire({ title: 'OTP không hợp lệ!', icon: 'error', timer: 1500 });
                console.log(err);
            }
        });
    }
}


