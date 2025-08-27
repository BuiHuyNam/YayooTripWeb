// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

// ---- API DTO (đúng theo dữ liệu bạn đưa) ----
export interface ApiLocationDto {
  id: string;
  name: string;
  description: string;
  address: string;
  position: string; // "48.8584° N, 2.2945° E"
  type: string;     // "Monument", "Historical Site", ...
}

// ---- App model (khớp với LocationCardComponent) ----
export interface LocationItem {
  id: string;
  name: string;
  address: string;
  description?: string;

  // mở rộng để hợp UI
  thumbnailUrl?: string;
  categoryId?: string;
  categoryName?: string; // dùng type của API
  price?: number;

  lat?: number;
  lng?: number;

  rating?: number;
  reviewCount?: number;
  distanceKm?: number;
  amenities?: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // 🔑 lấy base URL từ environment
  private readonly API_BASE_URL = environment.apiUrlTravelPlace; 
  private readonly ENDPOINT = '/TravelPlace';   // 👉 backend route, đổi cho đúng

  private readonly DEFAULT_THUMBNAIL = '/assets/images/sample-placeholder.jpg';

  constructor(private http: HttpClient) {}

  /** Lấy danh sách địa điểm, đã map sang LocationItem */
  getLocations(): Observable<LocationItem[]> {
    return this.http.get<ApiLocationDto[]>(`${this.API_BASE_URL}${this.ENDPOINT}`).pipe(
      map(list => list.map(dto => this.toLocationItem(dto))),
      catchError(err => {
        console.error('getLocations error:', err);
        return of([] as LocationItem[]);
      })
    );
  }

  /** Lấy chi tiết theo id (đã map) */
  getLocationById(id: string): Observable<LocationItem | null> {
    return this.http.get<ApiLocationDto>(`${this.API_BASE_URL}${this.ENDPOINT}/${id}`).pipe(
      map(dto => this.toLocationItem(dto)),
      catchError(err => {
        console.error('getLocationById error:', err);
        return of(null);
      })
    );
  }

  // ----------------- Helpers -----------------

  private toLocationItem(dto: ApiLocationDto): LocationItem {
    const { lat, lng } = this.parseLatLng(dto.position);

    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      description: dto.description,

      categoryId: this.slugify(dto.type),
      categoryName: dto.type,
      thumbnailUrl: this.DEFAULT_THUMBNAIL,

      lat,
      lng
    };
  }

  private parseLatLng(pos: string): { lat?: number; lng?: number } {
    try {
      if (!pos) return {};
      const cleaned = pos.replace(/°/g, '').replace(/\s+/g, ' ').trim();
      const [latPart, lngPart] = cleaned.split(',').map(s => s.trim());
      if (!latPart || !lngPart) return {};

      const latMatch = latPart.match(/([-+]?\d+(\.\d+)?)\s*([NS])/i);
      const lngMatch = lngPart.match(/([-+]?\d+(\.\d+)?)\s*([EW])/i);

      if (!latMatch || !lngMatch) return {};

      const latVal = parseFloat(latMatch[1]) * (latMatch[3].toUpperCase() === 'S' ? -1 : 1);
      const lngVal = parseFloat(lngMatch[1]) * (lngMatch[3].toUpperCase() === 'W' ? -1 : 1);
      return { lat: latVal, lng: lngVal };
    } catch {
      return {};
    }
  }

  private slugify(s: string): string {
    return (s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'unknown';
  }
}
