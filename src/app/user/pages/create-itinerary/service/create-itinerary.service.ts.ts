import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScheduleItem {
  travelPlaceId?: string;
  accomodationId?: string;
  startTime: string;
  endTime: string;
  estimatedCost?: number;
  name?: string;
  address?: string;
  kind?: 'destination' | 'service';
  attachedServices?: AttachedService[];
  gear?: string;
}

export interface AttachedService {
  id: string;
  serviceId: string;
  name: string;
  startTime?: string;
  endTime?: string;
  estimatedCost?: string | number;
  distanceKm: number;
}

export interface Itinerary {
  scheduleId?: string;
  name: string;
  description: string;
  status?: number;
  type?: string;
  items: ScheduleItem[];
}

export interface CreateItineraryResponse {
  scheduleId: string;
  message: string;
}

export interface TravelPlace {
  id: string;
  name: string;
  description: string;
  address: string;
  position?: string;
  type?: string;
}

//Service là Accomodation, Transportation, Food, Tour, Activity, etc.
export interface Service {
  id: string;
  name: string;
  description: string;
  address: string;
  position?: string;
  image?: string;
  status?: number;
}
export interface Destination {
  id: string;
  name: string;
  description: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateItineraryServiceTs {
  private readonly API_URL = environment.apiGatWay;
  constructor(private http: HttpClient) { }

  getItineraries(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.API_URL}/api/itinerary`);
  }
  createItinerary(itinerary: Itinerary): Observable<CreateItineraryResponse> {
    const token = localStorage.getItem('token'); // hoặc nơi bạn lưu token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<CreateItineraryResponse>(
      `${this.API_URL}/api/schedule`,
      itinerary,
      { headers }
    );
  }
  updateItinerary(itinerary: Itinerary): Observable<Itinerary> {
    return this.http.put<Itinerary>(`${this.API_URL}/api/schedule`, itinerary);
  }
  deleteItinerary(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/api/itinerary/${id}`);
  }
  getTravelPlaces(): Observable<TravelPlace[]> {
    return this.http.get<TravelPlace[]>(`${this.API_URL}/api/travelplace`);
  }
  getTravelPlacesById(id: string): Observable<TravelPlace> {
    return this.http.get<TravelPlace>(`${this.API_URL}/api/travelplace/${id}`);
  }
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.API_URL}/api/accomodation`);
  }
  getServicesById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.API_URL}/api/accomodation/${id}`);
  }
}
