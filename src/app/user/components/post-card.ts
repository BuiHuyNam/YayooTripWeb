import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface PostAuthor {
  name: string;
  avatarUrl: string;
  verified?: boolean;
}

export interface TripInfo {
  title: string;         // "Khám phá Sapa 3 ngày 2 đêm - Trekking..."
  meta: string;          // "3 ngày • 2.5 triệu VND"
}

export interface Post {
  id: string;
  author: PostAuthor;
  timeAgo: string;       // "2 giờ trước"
  title: string;
  content: string;
  rating?: number;       // 4.8
  reviewCount?: number;  // 23
  tags?: string[];       // ["Sapa","Fansipan","Cát Cát"]
  photos?: string[];     // 2 ảnh
  trip?: TripInfo;
  stats?: { likes: number; comments: number; shares: number; saves: number };
  liked?: boolean;
  saved?: boolean;
}

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<article class="rounded-2xl border bg-background overflow-hidden p-0">
  <!-- Header -->
  <div class="p-4 sm:p-6">
    <div class="flex items-start gap-3">
      <img [src]="post.author.avatarUrl || '/assets/images/avatar.jpg'" (error)="onImgErr($event)"
           alt="" class="h-10 w-10 rounded-full object-cover" />
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold">{{ post.author.name }}</span>
          <span *ngIf="post.author.verified"
                class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            Verified
          </span>
        </div>
        <div class="text-xs text-muted-foreground">{{ post.timeAgo }}</div>
      </div>
      <!-- (tùy chọn) menu … -->
    </div>

    <!-- Title -->
    <h3 class="mt-4 text-xl font-bold leading-snug">
      {{ post.title }}
    </h3>

    <!-- Content -->
    <p class="mt-2 text-muted-foreground">
      {{ post.content }}
    </p>

    <!-- Rating -->
    <div *ngIf="post.rating != null" class="mt-3 flex items-center gap-2 text-sm">
      <span class="inline-flex items-center gap-1 text-yellow-600">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
        <span class="font-semibold">{{ post.rating | number:'1.1-1' }}</span>
      </span>
      <span class="text-muted-foreground">{{ post.reviewCount }} đánh giá</span>
    </div>

    <!-- Tags -->
    <div *ngIf="post.tags?.length" class="mt-3 flex flex-wrap gap-2">
      <span *ngFor="let tag of post.tags" class="px-3 py-1 rounded-full border text-sm bg-white">{{ tag }}</span>
    </div>
  </div>

  <!-- Photos -->
  <div *ngIf="post.photos?.length" class="px-4 sm:px-6 pb-4">
    <div class="grid grid-cols-2 gap-3">
      <img *ngFor="let p of post.photos; index as i"
           [src]="p" (error)="onPhotoErr($event)" alt=""
           class="h-44 sm:h-52 w-full object-cover rounded-xl border" />
    </div>
  </div>

  <!-- Trip block -->
  <div *ngIf="post.trip" class="mx-4 sm:mx-6 mb-4">
    <div class="rounded-xl border bg-white p-4 flex items-start justify-between gap-3">
      <div class="flex items-start gap-3">
        <div class="mt-1">
          <svg viewBox="0 0 24 24" class="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div>
          <div class="font-semibold">{{ post.trip.title }}</div>
          <div class="text-sm text-muted-foreground">{{ post.trip.meta }}</div>
        </div>
      </div>
      <button routerLink="/itineraries/1" type="button" class="px-3 py-2 rounded-md text-sm border inline-flex items-center gap-1">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M15 12H9m3-3v6"></path>
        </svg>
        Xem lịch trình
      </button>
    </div>
  </div>

  <!-- Actions -->
  <div class="px-4 sm:px-6 py-3 border-t flex items-center gap-6 text-sm">
    <button type="button" class="inline-flex items-center gap-1"
            [class.text-red-600]="post.liked" (click)="toggleLike()">
      <svg viewBox="0 0 24 24" class="h-5 w-5" [attr.fill]="post.liked ? 'currentColor' : 'none'"
           stroke="currentColor" stroke-width="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
      </svg>
      {{ post.stats?.likes || 0 }}
    </button>

    <button type="button" class="inline-flex items-center gap-1">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
      </svg>
      {{ post.stats?.comments || 0 }}
    </button>

    <button type="button" class="inline-flex items-center gap-1">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.59 5.58L20 12l-8-8-8 8z"/>
      </svg>
      {{ post.stats?.shares || 0 }}
    </button>

    <button type="button" class="inline-flex items-center gap-1 ml-auto"
            [class.text-amber-600]="post.saved" (click)="toggleSave()">
      <svg viewBox="0 0 24 24" class="h-5 w-5" [attr.fill]="post.saved ? 'currentColor' : 'none'"
           stroke="currentColor" stroke-width="2">
        <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z"/>
      </svg>
      Đánh giá
    </button>
  </div>
</article>
  `,
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() like = new EventEmitter<Post>();
  @Output() save = new EventEmitter<Post>();

  toggleLike() {
    this.post.liked = !this.post.liked;
    if (this.post.stats) this.post.stats.likes += this.post.liked ? 1 : -1;
    this.like.emit(this.post);
  }
  toggleSave() {
    this.post.saved = !this.post.saved;
    this.save.emit(this.post);
  }

  onImgErr(e: Event) { (e.target as HTMLImageElement).src = '/assets/images/avatar.jpg'; }
  onPhotoErr(e: Event) { (e.target as HTMLImageElement).src = '/assets/images/sample-placeholder.jpg'; }
}
