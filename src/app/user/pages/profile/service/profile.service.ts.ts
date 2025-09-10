import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string,
  createdAt: string,
  createBy: string,
  updateAt: string,
  updateBy: string,
  name: string,
  email: string,
  phone: string,
  password: string,
  avartaImage: string,
  roleName: string
}
export interface UpdateUserRequest {
  name: string,
  email: string,
  phone: string,
  password?: string,
  avartaImage: string,
  roleName: string
}
export interface ScheduleItem {

  scheduleId: string,
  travelPlaceId: string,
  accomodationId: string,
  startTime: string,
  endTime: string

}
export interface Schedule {
  id: string,
  name: string,
  description: string,
  created: string,
  updated: string,
  status: number,
  userId: string,
  type: string,
  items: ScheduleItem[]
}
@Injectable({
  providedIn: 'root'
})

export class ProfileServiceTs {
  private readonly API_URL = environment.apiGatWay;
  constructor(private http: HttpClient) { }
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/api/user/${id}`,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('login')}`
        })
      }
    );
  }
  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/api/user/${id}`, user,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('login')}`
        })
      }
    );
  }

  getAllSchedule(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.API_URL}/api/schedule`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('login')}`
        })
      }
    );
  }


}
