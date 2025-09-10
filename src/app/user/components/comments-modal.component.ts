import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentItem, CommentsService } from '../comments.service';
import { Post as CardPost} from './post-card';

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <!-- backdrop -->
  <div class="fixed inset-0 z-[100] bg-black/50" (click)="close.emit()"></div>

  <!-- modal -->
  <div class="fixed inset-0 z-[101] flex items-start sm:items-center justify-center p-2 sm:p-6">
    <div class="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl"
         (click)="$event.stopPropagation()">
      <!-- header -->
      <div class="flex items-center justify-between px-4 py-3 border-b">
        <div class="font-semibold truncate">{{ post.title || 'Bình luận' }}</div>
        <button class="p-2 hover:bg-gray-100 rounded-full" (click)="close.emit()">✕</button>
      </div>

      <!-- body -->
      <div class="grid grid-cols-1 sm:grid-cols-5">
        <!-- trái: nội dung ngắn gọn của post (ẩn trên mobile nếu muốn) -->
        <div class="hidden sm:block sm:col-span-2 border-r p-4">
          <div class="flex items-center gap-2 mb-3">
            <!-- SỬA 1: author?.avatarUrl -->
             <img [src]="post.author.avatarUrl || 'assets/images/avatar.jpg'"
                 class="h-9 w-9 rounded-full object-cover"> 
            <div>
              <!-- SỬA 2: author?.name -->
              <div class="font-medium">{{ post.author.name }}</div>
              <div class="text-xs text-gray-500">{{ post.timeAgo }}</div>
            </div>
          </div>
          <div class="font-semibold mb-1">{{ post.title }}</div>
          <div class="text-sm text-gray-700 whitespace-pre-line">{{ post.content }}</div>
          <div *ngIf="post?.photos?.length" class="mt-3 grid grid-cols-2 gap-2">
            <img *ngFor="let p of post!.photos | slice:0:2" [src]="p" class="h-24 w-full object-cover rounded-lg">
          </div>
        </div>

        <!-- phải: luồng bình luận -->
        <div class="sm:col-span-3 flex flex-col h-[70vh]">
          <div class="flex-1 overflow-y-auto p-4 space-y-4" id="scrollArea">
            <ng-container *ngIf="!loading; else loadingTpl">
              <div *ngFor="let c of comments; trackBy: trackById" class="flex gap-3">
                <img [src]="c.userAvatar || 'assets/images/avatar.jpg'" class="h-8 w-8 rounded-full object-cover mt-1">
                <div>
                  <div class="bg-gray-100 rounded-2xl px-3 py-2">
                    <div class="text-sm font-medium">{{ c.userName }}</div>
                    <div class="text-sm whitespace-pre-line">{{ c.content }}</div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">{{ timeAgo(c.createdAt) }}</div>
                </div>
              </div>

              <div *ngIf="comments.length === 0" class="text-sm text-gray-500 text-center py-8">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </div>
            </ng-container>

            <ng-template #loadingTpl>
              <div class="text-sm text-gray-500 text-center py-8">Đang tải bình luận…</div>
            </ng-template>
          </div>

          <!-- input -->
          <form (submit)="send($event)" class="p-3 border-t flex items-end gap-2">
            <!-- SỬA 3: author?.avatarUrl -->
          <img [src]="post.author.avatarUrl || 'assets/images/avatar.jpg'"
                 class="h-8 w-8 rounded-full object-cover"> 
            <textarea [(ngModel)]="draft" name="draft" rows="1"
                      placeholder="Viết bình luận công khai…"
                      class="flex-1 resize-none border rounded-xl px-3 py-2 focus:outline-none focus:ring"
                      [disabled]="sending"></textarea>
            <button type="submit"
                    class="px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
                    [disabled]="sending || !draft.trim()">
              {{ sending ? 'Đang gửi…' : 'Gửi' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  `
})
export class CommentsModalComponent implements OnInit {
  @Input({ required: true }) post!: CardPost; // đảm bảo luôn có
  @Output() close = new EventEmitter<void>();
  @Input({ required: true }) postId!: string;   // [THÊM] dùng id riêng để gọi API
 

  comments: CommentItem[] = [];
  draft = '';
  loading = false;
  sending = false;

  private api = inject(CommentsService);

  ngOnInit(): void {
  const id = (this.postId || '').trim();      // [THÊM] chặn id rỗng/sai
    if (!id) { console.error('postId is empty'); return; }

    this.loading = true;
    this.api.getComments(this.post.id).subscribe({
      next: (list) => { this.comments = list; this.loading = false; queueMicrotask(this.scrollToBottom); },
      error: () => { this.loading = false; }
    });
  }

  send(e: Event) {
    e.preventDefault();
    const content = this.draft.trim();
    if (!content || this.sending) return;

    this.sending = true;
    this.api.addComment(this.post.id, content).subscribe({
      next: (c) => {
        this.comments.push(c);
        this.draft = '';
        this.sending = false;
        this.scrollToBottom();
      },
      error: () => { this.sending = false; }
    });
  }

  scrollToBottom = () => {
    const el = document.getElementById('scrollArea');
    if (el) el.scrollTop = el.scrollHeight;
  };

  trackById(_: number, c: CommentItem) { return c.id; }

  timeAgo(d: string | Date) {
    const t = new Date(d).getTime(); const s = Math.floor((Date.now() - t)/1000);
    if (s < 60) return `${s}s`; const m = Math.floor(s/60);
    if (m < 60) return `${m} phút`; const h = Math.floor(m/60);
    if (h < 24) return `${h} giờ`; const dd = Math.floor(h/24);
    return `${dd} ngày`;
  }
}
