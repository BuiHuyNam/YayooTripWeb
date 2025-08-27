import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// export interface LocationItem {
//   id: string;
//   name: string;
//   categoryId: string;      // ví dụ: 'attractions' | 'restaurants' | 'cafes' | 'hotels' | 'shopping'
//   categoryName: string;    // nhãn hiển thị
//   price: number;
//   address: string;
//   lat: number;
//   lng: number;
//   thumbnailUrl: string;
//   rating: number;
//   reviewCount: number;
//   distanceKm: number;
//   description: string;
//   amenities: string[];
// }
export interface LocationItem {
  id: string;
  name: string;
  address: string;
  description?: string;

  // tuỳ chọn cho UI
  thumbnailUrl?: string;
  categoryId?: string;
  categoryName?: string;
  price?: number;

  lat?: number;
  lng?: number;

  rating?: number;
  reviewCount?: number;
  distanceKm?: number;
  amenities?: string[];
}

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full">
      <!-- Card -->
      <div class="border rounded-2xl shadow-sm bg-white h-full">
        <!-- Header -->
        <div class="px-4 py-3 border-b flex items-center justify-between">
          <div class="flex items-center gap-2 text-base font-semibold">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 22l18-10L3 2v7l13 3-13 3v7z"></path>
            </svg>
            Bản đồ khám phá
          </div>
          <div class="flex items-center gap-2">
            <button class="inline-flex items-center justify-center h-8 w-8 rounded-md border hover:bg-gray-50"
                    (click)="cycleLayer()"
                    aria-label="Layers">
              <!-- Layers -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l10 5-10 5L2 7l10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center h-8 w-8 rounded-md border hover:bg-gray-50"
                    (click)="zoomIn()" aria-label="Zoom in">
              <!-- ZoomIn -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.3-4.3"></path>
                <path d="M11 8v6"></path>
                <path d="M8 11h6"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center h-8 w-8 rounded-md border hover:bg-gray-50"
                    (click)="zoomOut()" aria-label="Zoom out">
              <!-- ZoomOut -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.3-4.3"></path>
                <path d="M8 11h6"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center h-8 w-8 rounded-md border hover:bg-gray-50"
                    (click)="resetView()" aria-label="Reset view">
              <!-- RotateCcw -->
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 4v6h6"></path>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-0">
          <div class="relative">
            <!-- Map container (placeholder) -->
            <div class="w-full h-[500px] bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden select-none">
              <!-- Gradient background -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50"></div>

              <!-- Grid pattern -->
              <div class="absolute inset-0 opacity-20">
                <div class="grid grid-cols-10 grid-rows-10 h-full w-full">
                  <div *ngFor="let _ of gridCells; let i = index"
                       class="border border-gray-300"></div>
                </div>
              </div>

              <!-- Location markers -->
              <ng-container *ngFor="let loc of locations; let idx = index">
                <div class="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all"
                     [ngClass]="selectedLocation?.id === loc.id ? 'scale-125 z-10' : 'hover:scale-110 z-0'"
                     [ngStyle]="markerStyle(idx)"
                     (click)="select(loc)">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                       >
                    <!-- MapPin icon -->
                    <svg class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>

                  <!-- Popover -->
                  <div *ngIf="selectedLocation?.id === loc.id"
                       class="absolute top-10 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-48 z-20">
                    <div class="text-sm font-medium">{{ loc.name }}</div>
                    <div class="text-xs text-gray-500">{{ loc.categoryName }}</div>
                    <div class="text-xs text-blue-600 font-medium">~ {{ loc.price | number }} đ</div>
                  </div>
                </div>
              </ng-container>

              <!-- Center marker (user location) -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600/20 rounded-full animate-ping"></div>
              </div>

              <!-- Map controls overlay -->
              <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2">
                <div class="text-xs text-gray-500">
                  Vị trí hiện tại: {{ currentPlaceLabel }}
                </div>
              </div>

              <!-- Legend -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 space-y-2">
                <div class="text-xs font-medium">Chú thích</div>
                <div class="space-y-1 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-blue-500"></span> <span>Tham quan</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-red-500"></span> <span>Nhà hàng</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-yellow-500"></span> <span>Cà phê</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-green-500"></span> <span>Khách sạn</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-purple-500"></span> <span>Mua sắm</span>
                  </div>
                </div>
              </div>

              <!-- Integration notice -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="bg-white/80 backdrop-blur rounded-lg p-4 text-center max-w-sm">
                  <svg class="h-8 w-8 text-blue-600 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <p class="text-sm font-medium">Bản đồ tương tác</p>
                  <p class="text-xs text-gray-500">
                    Tích hợp Google Maps/Mapbox để hiển thị bản đồ thực tế
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Demo button (giữ lại nếu muốn test emit) -->
          <div class="p-4">
            <button class="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    (click)="emitFirst()">Chọn địa điểm đầu tiên (test)</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LocationMapComponent {
  /** Data vào */
  @Input() locations: LocationItem[] = [];
  /** Chọn hiện tại (nếu muốn điều khiển từ cha) */
  @Input() selectedLocation: LocationItem | null = null;
  /** Nhãn vị trí hiện tại (ví dụ: "Sapa, Lào Cai") */
  @Input() currentPlaceLabel = 'Sapa, Lào Cai';

  /** Emit ra khi chọn */
  @Output() locationSelected = new EventEmitter<LocationItem>();

  /** Grid 10x10 cho placeholder */
  gridCells = Array.from({ length: 100 });

  /** Giả lập layer/zoom (tùy bạn map vào lib map sau) */
  private zoomLevel = 1;
  private layerIndex = 0;

  select(loc: LocationItem) {
    this.selectedLocation = loc;
    this.locationSelected.emit(loc);
  }

  emitFirst() {
    if (this.locations?.length) {
      this.select(this.locations[0]);
    }
  }

  zoomIn() { this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3); }
  zoomOut() { this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.5); }
  resetView() { this.zoomLevel = 1; }
  cycleLayer() { this.layerIndex = (this.layerIndex + 1) % 3; }

  /** Màu theo category tương tự mẫu React */
  categoryColor(category: string): string {
    switch ((category || '').toLowerCase()) {
      case 'attractions': return 'bg-blue-500';
      case 'restaurants': return 'bg-red-500';
      case 'cafes':       return 'bg-yellow-500';
      case 'hotels':      return 'bg-green-500';
      case 'shopping':    return 'bg-purple-500';
      default:            return 'bg-gray-500';
    }
  }

  /** Tính vị trí marker (layout giả lập như demo) */
  markerStyle(index: number) {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const left = 20 + col * 20; // %
    const top  = 20 + row * 20; // %
    return { left: left + '%', top: top + '%' };
  }
}
