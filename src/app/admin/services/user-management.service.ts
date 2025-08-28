import { Injectable, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";


// Interface User khớp với JSON bạn đưa
export interface User {
    id: string;
    createdAt: string;
    createBy: string;
    updateAt: string;
    updateBy: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    avartaImage: string;
    roleName: string;
}

@Injectable({ providedIn: 'root' })

export class UserManagementService {
    private readonly API_URL = environment.apiGatWay;


    // state trong service để component có thể subscribe
    private usersSubject = new BehaviorSubject<User[]>([]);
    public users$ = this.usersSubject.asObservable();

    constructor(private http: HttpClient) { }

    // giống pattern login(): trả Observable + tap để cập nhật state
    loadData(): Observable<User[]> {
        const token = localStorage.getItem('login');  // lấy token đã lưu

        const headers = new HttpHeaders({
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        });

        return this.http.get<User[]>(`${this.API_URL}/api/user`, { headers });
    }

    // lấy snapshot ngay lập tức nếu cần
    getUsersSnapshot(): User[] {
        return this.usersSubject.value;
    }


}