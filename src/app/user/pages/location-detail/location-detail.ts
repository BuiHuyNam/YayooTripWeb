import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { LocationItem } from '../../components/location-card';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-detail.html',
})
export class LocationDetail implements OnChanges {
  @Input() id?: string;                 // 👈 nhận id từ cha (modal)
  @Input() location?: LocationItem;     // (optional) có sẵn data thì show luôn

  loading = false;
  errorMsg = '';
  readonly PLACEHOLDER = '/assets/images/sample-placeholder.jpg'; // [THÊM]
  imgSrc = this.PLACEHOLDER;                                      // [THÊM]
  private usedFallback = false;   

  private user = inject(UserService);
  private route = inject(ActivatedRoute);

  ngOnChanges(_: SimpleChanges) {
    if (this.location) {                                          // [SỬA]
      this.syncImgSrc();
      return;
    }
    const id = this.id ?? this.route.snapshot.paramMap.get('id') ?? undefined;
    if (!id) return;

    this.loading = true;
    this.user.getLocationById(id).subscribe({
      next: loc => {
        this.location = loc ?? undefined;
        this.syncImgSrc();                                        // [THÊM]
        this.loading = false;
        if (!loc) this.errorMsg = 'Không tìm thấy địa điểm.';
      },
      error: err => {
        console.error(err);
        this.errorMsg = 'Không thể tải chi tiết địa điểm.';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {                                              // [THÊM] theo dõi param id nếu đi qua router
    if (!this.id && !this.location) {
      this.route.paramMap.subscribe(pm => {
        const rid = pm.get('id');
        if (!rid) return;
        this.loading = true;
        this.user.getLocationById(rid).subscribe({
          next: loc => {
            this.location = loc ?? undefined;
            this.syncImgSrc();                                    // [THÊM]
            this.loading = false;
            if (!loc) this.errorMsg = 'Không tìm thấy địa điểm.';
          },
          error: err => {
            console.error(err);
            this.errorMsg = 'Không thể tải chi tiết địa điểm.';
            this.loading = false;
          }
        });
      });
    }
  }
    private syncImgSrc() {                                          // [THÊM]
    this.usedFallback = false;
    const u = (this.location?.urlImage || '').trim();             // [SỬA] dùng urlImage
    this.imgSrc = u || this.PLACEHOLDER;
  }

 onImgError(e: Event) {                                          // [SỬA]
    if (this.usedFallback) return;
    this.usedFallback = true;
    (e.target as HTMLImageElement).onerror = null;
    this.imgSrc = this.PLACEHOLDER;
  }
}
