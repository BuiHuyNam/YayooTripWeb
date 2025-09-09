import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// export interface LocationItem {
//   id: string;
//   name: string;
//   categoryId: string;
//   price: number;
//   address: string;
//   lat: number;
//   lng: number;
//   thumbnailUrl?: string;

//   // các field tùy chọn để hiện UI đẹp hơn (không bắt buộc truyền)
//   categoryName?: string;   // "Khách sạn", "Nhà hàng", ...
//   rating?: number;         // 4.7
//   reviewCount?: number;    // 856
//   distanceKm?: number;     // 0.5
//   description?: string;    // mô tả ngắn
//   amenities?: string[];    // ["Spa","Nhà hàng","Gym",...]
// }
export interface LocationItem {
  id: string;
  name: string;
  address: string;
  description?: string;

  // tuỳ chọn cho UI
  urlImage?: string;
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
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-card.html'
})
export class LocationCardComponent {
  @Input({ required: true }) location!: LocationItem;
  @Input() compact = false;
  @Output() select = new EventEmitter<LocationItem>();

  // $$$ theo ngưỡng đơn giản
  get priceTier(): string {
    const p = this.location?.price ?? 0;
    if (p >= 1_000_000) return '$$$';
    if (p >= 300_000) return '$$';
    return '$';
  }

  get amenitiesToShow(): string[] {
    return (this.location.amenities || []).slice(0, 3);
  }
  get amenitiesMore(): number {
    const total = this.location.amenities?.length || 0;
    return total > 3 ? total - 3 : 0;
    }

     readonly PLACEHOLDER = '/assets/images/sample-placeholder.jpg';
  imgSrc = this.PLACEHOLDER;
  private usedFallback = false;

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['location']) {
      this.usedFallback = false;
      const u = (this.location?.urlImage || '').trim();
      this.imgSrc = u || this.PLACEHOLDER;     // ⬅️ không bind trực tiếp location.urlImage trong HTML
    }
  }

  onImgError(ev: Event) {
    if (this.usedFallback) return;             // ⬅️ chỉ fallback 1 lần để tránh vòng lặp
    this.usedFallback = true;
    const img = ev.target as HTMLImageElement;
    img.onerror = null;
    this.imgSrc = this.PLACEHOLDER;
  }
}
