import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

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

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    // Login API
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
            .pipe(
                tap(response => {
                    // this.login = true;
                    this.setToken(response.token);
                    this.setCurrentUser(response.user);
                })
            );
    }

    // Register API
    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
            .pipe(
                tap(response => {
                    this.setToken(response.token);
                    this.setCurrentUser(response.user);
                })
            );
    }

    // Logout
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Get token
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Set token
    private setToken(token: string): void {
        localStorage.setItem('token', token);
    }

    // Set current user
    private setCurrentUser(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    // Load user from storage on app initialization
    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
            } catch (error) {
                console.error('Error parsing user from storage:', error);
                this.logout();
            }
        }
    }

    // Get HTTP headers with authorization token
    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }
}
