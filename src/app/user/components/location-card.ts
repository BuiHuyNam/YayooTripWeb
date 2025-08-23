import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LocationItem {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  address: string;
  lat: number;
  lng: number;
  thumbnailUrl?: string;

  // các field tùy chọn để hiện UI đẹp hơn (không bắt buộc truyền)
  categoryName?: string;   // "Khách sạn", "Nhà hàng", ...
  rating?: number;         // 4.7
  reviewCount?: number;    // 856
  distanceKm?: number;     // 0.5
  description?: string;    // mô tả ngắn
  amenities?: string[];    // ["Spa","Nhà hàng","Gym",...]
}

@Component({
  selector: 'app-location-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<article class="rounded-2xl border bg-background overflow-hidden shadow-sm hover:shadow transition"
         [class.flex]="compact" [class.items-center]="compact" [class.gap-3]="compact">

  <!-- Ảnh & overlay -->
  <ng-container *ngIf="!compact; else compactImg">
    <div class="relative h-48 w-full">
      <img [src]="location.thumbnailUrl || '/assets/images/sample-placeholder.jpg'"
           (error)="onImgError($event)" alt="{{ location.name }}"
           class="h-full w-full object-cover" />

      <!-- Badge loại -->
      <span *ngIf="location.categoryName"
            class="absolute left-3 top-3 text-xs rounded-full px-2 py-1 bg-white/90 border">
        {{ location.categoryName }}
      </span>

      <!-- Rating + Tim -->
      <div class="absolute right-3 top-3 flex items-center gap-2">
        <span *ngIf="location.rating != null"
              class="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs border">
          <svg viewBox="0 0 24 24" class="h-4 w-4 text-yellow-500" fill="currentColor">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          {{ location.rating | number:'1.1-1' }}
        </span>
        <button type="button"
                class="h-8 w-8 rounded-full bg-white/90 border flex items-center justify-center hover:bg-white"
                title="Yêu thích">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
          </svg>
        </button>
      </div>
    </div>
  </ng-container>

  <ng-template #compactImg>
    <img [src]="location.thumbnailUrl || '/assets/images/sample-placeholder.jpg'"
         (error)="onImgError($event)" alt="{{ location.name }}"
         class="h-16 w-16 object-cover rounded-md m-3" />
  </ng-template>

  <!-- Nội dung -->
  <div class="p-4" [class.p-0]="compact">
    <!-- Compact -->
    <div class="p-4" *ngIf="compact; else fullContent">
      <div class="font-semibold">{{ location.name }}</div>
      <div class="text-sm text-muted-foreground truncate">{{ location.address }}</div>
      <div class="text-sm">Giá: {{ location.price | number }} đ</div>
    </div>

    <!-- Full -->
    <ng-template #fullContent>
      <!-- Tiêu đề + $$$ -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold">{{ location.name }}</h3>
        <div class="text-red-600 font-bold">{{ priceTier }}</div>
      </div>

      <!-- Khoảng cách + đánh giá -->
      <div class="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
        <span *ngIf="location.distanceKm != null" class="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 5.25-9 12-9 12S3 15.25 3 10a9 9 0 1 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {{ location.distanceKm | number:'1.1-1' }} km
        </span>
        <span *ngIf="location.reviewCount != null">
          {{ location.reviewCount | number:'1.0-0' }} đánh giá
        </span>
      </div>

      <!-- Mô tả -->
      <p *ngIf="location.description" class="mt-2 text-muted-foreground">
        {{ location.description }}
      </p>

      <!-- Giá -->
      <div class="mt-2 text-primary font-semibold">
        {{ location.price }} VND/đêm
        <span class="ml-2 text-sm text-muted-foreground">• 24/7</span>
      </div>

      <!-- Actions (UI thôi, cùng emit select) -->
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" class="px-3 py-2 rounded-md text-sm bg-indigo-100 text-indigo-900"
                (click)="select.emit(location)">
          Chi tiết
        </button>
        <button type="button" class="px-3 py-2 rounded-md text-sm border"
                (click)="select.emit(location)">
          Đánh giá
        </button>
        <button type="button"
                class="px-3 py-2 rounded-md text-sm bg-teal-600 text-white hover:bg-teal-700"
                (click)="select.emit(location)">
          Thêm vào lịch trình
        </button>
      </div>

      <!-- Amenities -->
      <div *ngIf="(location.amenities?.length || 0) > 0" class="mt-4 flex flex-wrap gap-2">
        <span *ngFor="let a of amenitiesToShow" class="px-3 py-1 rounded-full border text-sm bg-white">{{ a }}</span>
        <span *ngIf="amenitiesMore > 0" class="px-3 py-1 rounded-full border text-sm bg-white">+{{ amenitiesMore }}</span>
      </div>
    </ng-template>
  </div>
</article>
  `,
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

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/images/avatar.jpg';
  }
}
