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

  private user = inject(UserService);
  private route = inject(ActivatedRoute);

  ngOnChanges(_: SimpleChanges) {
    // có location sẵn thì không cần gọi lại
    if (this.location) return;

    const id = this.id ?? this.route.snapshot.paramMap.get('id') ?? undefined;
    if (!id) return;

    this.loading = true;
    this.user.getLocationById(id).subscribe({
      next: (loc) => {
        this.location = loc ?? undefined;
        this.loading = false;
        if (!loc) this.errorMsg = 'Không tìm thấy địa điểm.';
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Không thể tải chi tiết địa điểm.';
        this.loading = false;
      }
    });
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/da-lat-flower-gardens-pine-forests-vietnam.png';
  }
}
