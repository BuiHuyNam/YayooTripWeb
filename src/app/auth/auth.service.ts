// src/app/core/services/auth.service.ts  (điều chỉnh path theo dự án của bạn)
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment'; // ⚠️ chỉnh path nếu khác

// ====== Interfaces ======
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
    };
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export interface JwtPayload {
    UserId?: string;
    unique_name?: string;
    role?: string | string[];
    nbf?: number;
    exp?: number;
    iat?: number;
    iss?: string;
    aud?: string;
    [k: string]: any;
}
export interface RegisterOtp {
    email: string;
    otp: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API_URL = environment.apiUrl;
    private readonly TOKEN_KEY = 'token';
    private readonly USER_KEY = 'user';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly isBrowser: boolean;

    constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            this.loadUserFromStorage();
        }
    }

    // ====== Auth APIs ======

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
            tap((response) => {
                this.setToken(response.token);
                this.setCurrentUser(response.user);
            })
        );
    }

    // Register API (OTP flow-friendly)
    register(userData: RegisterRequest): Observable<AuthResponse | any> {
        return this.http.post<AuthResponse | any>(`${this.API_URL}/register`, userData).pipe(
            tap((response: any) => {
                if (response && response.token) {
                    this.setToken(response.token);
                }
                if (response && response.user) {
                    this.setCurrentUser(response.user);
                }
            })
        );
    }
    verifyOtp(otp: RegisterOtp): Observable<AuthResponse> {
        // otp.email = this.getUsernameFromToken() || '';
        console.log(this.getUsernameFromToken());
        return this.http.post<AuthResponse>(`${this.API_URL}/verify-otp`, otp).pipe(
            tap((response) => {
                this.setToken(response.token);
                this.setCurrentUser(response.user);
            })
        );
    }

    // Logout
    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        }
        this.currentUserSubject.next(null);
    }

    // ====== State & Getters ======

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        return !this.isTokenExpired(token);
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Get token
    getToken(): string | null {
        if (!this.isBrowser) return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        });
    }

    // ====== JWT helpers ======

    /** Giải mã payload JWT (không verify chữ ký) */
    decodeToken<T = JwtPayload>(token?: string | null): T | null {
        const raw = token ?? this.getToken();
        if (!raw) return null;
        const parts = raw.split('.');
        if (parts.length !== 3) return null;
        try {
            const json = this.base64UrlToString(parts[1]);
            return JSON.parse(json) as T;
        } catch {
            return null;
        }
    }

    /** Token hết hạn chưa? (dựa vào exp - seconds) */
    isTokenExpired(token?: string | null): boolean {
        const p = this.decodeToken<JwtPayload>(token);
        if (!p?.exp) return false; // không có exp => coi như chưa hết hạn (tuỳ chính sách)
        const now = Math.floor(Date.now() / 1000);
        return now >= p.exp;
    }

    /** Lấy roles từ token (chuẩn hoá thành mảng) */
    getRoles(): string[] {
        const p = this.decodeToken<JwtPayload>();
        const r = p?.role;
        if (!r) return [];
        return Array.isArray(r) ? r : [r];
    }

    /** Lấy username theo claim unique_name (tuỳ backend) */
    getUsernameFromToken(): string | undefined {
        return this.decodeToken<JwtPayload>()?.unique_name;
    }

    /** Lấy userId theo claim UserId (tuỳ backend) */
    getUserIdFromToken(): string | undefined {
        return this.decodeToken<JwtPayload>()?.UserId;
    }

    // ====== Private ======

    private setToken(token: string): void {
        if (!this.isBrowser) return;
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    // Set current user
    private setCurrentUser(user: User): void {
        if (this.isBrowser) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
    }

    // Load user from storage on app initialization
    private loadUserFromStorage(): void {
        if (!this.isBrowser) return;
        const userStr = localStorage.getItem(this.USER_KEY);
        if (userStr) {
            try {
                const user = JSON.parse(userStr) as User;
                this.currentUserSubject.next(user);
            } catch (error) {
                console.error('Error parsing user from storage:', error);
                this.logout();
            }
        }
    }

    private base64UrlToString(input: string): string {
        let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) base64 += '=';
        // Guard atob for SSR
        const binary = (this.isBrowser ? atob(base64) : Buffer.from(base64, 'base64').toString('binary')) as string;
        try {
            return decodeURIComponent(
                binary.split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
            );
        } catch {
            return binary;
        }
    }
}
