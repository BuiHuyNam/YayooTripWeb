import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ItineraryAccommodationDto {
    id: string;
    name: string;
    description: string;
    address: string;
    position: string;
    imageUrl: string;
    checkinImages: string[];
    status: number;
}

export interface ItineraryTravelDto {
    id: string;
    name: string;
    description: string;
    address: string;
    position: string;
    type: string;
    accomodations: ItineraryAccommodationDto[];
}

export interface ItineraryDetailDto {
    id: string;
    name: string;
    description: string;
    created: string;
    updated: string;
    status: number;
    type: string;
    userId: string;
    travels: ItineraryTravelDto[];
}

@Injectable({ providedIn: 'root' })
export class ItineraryViewService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiGatWay || '/api';

    getById(id: string) {
        const token = localStorage.getItem('token'); // nơi bạn đã lưu token khi login
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.get<ItineraryDetailDto>(
            `${this.baseUrl}/api/schedule/${id}`,
            { headers }
        );
    }
}


