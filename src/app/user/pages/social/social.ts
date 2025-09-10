import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post as CardPost, PostCardComponent } from '../../components/post-card';
import { SocialService, Post as ServicePost, Post } from '../../social.service';
import { FormsModule } from '@angular/forms';
import { finalize, firstValueFrom } from 'rxjs';
import { CommentsModalComponent } from '../../components/comments-modal.component';
import Swal from 'sweetalert2';

type Privacy = 'public' | 'friends' | 'private';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule, PostCardComponent, FormsModule, CommentsModalComponent],
  templateUrl: './social.html',
  styleUrls: ['./social.css']
})
export class Social implements OnInit, OnDestroy {
  constructor(private socialService: SocialService) {}

  posts: CardPost[] = [];

  // ===== NEW: state cho upload ảnh =====
  selectedFiles: File[] = [];
  previewUrls: string[] = []; // URL.createObjectURL để preview

  // ===== Composer/others =====
  isSubmitting = false;
  newPost = { title: '', content: '', postImg: '' };

  currentUser = { name: 'Minh Anh', avatarUrl: 'assets/images/avatar.jpg' };
  composerAvatars = ['/assets/images/avatar.jpg','/assets/images/avatar2.jpg','/assets/images/avatar3.jpg'];

  isComposerOpen = false;
  openComposer()  { this.isComposerOpen = true; }
  closeComposer() { this.isComposerOpen = false; }

  @HostListener('document:keydown.escape') onEsc() { this.closeComposer(); }

  isPrivacyOpen = false;
  selectedPrivacy: Privacy = 'public';
  privacyLabel: Record<Privacy, string> = {
    public: 'Công khai', friends: 'Bạn bè', private: 'Riêng tư',
  };
  togglePrivacy() { this.isPrivacyOpen = !this.isPrivacyOpen; }
  selectPrivacy(v: Privacy) { this.selectedPrivacy = v; this.isPrivacyOpen = false; }

  ngOnInit(): void {
    this.socialService.getPosts().subscribe({
      next: (data: ServicePost[]) => {
        this.posts = data.map(p => this.mapServicePostToCardPost(p));
      },
      error: (e) => console.error('Load posts failed:', e)
    });
  }

  ngOnDestroy(): void {
    // dọn objectURL
    this.previewUrls.forEach(u => URL.revokeObjectURL(u));
  }

  // Map Post (service) -> Post (card)
  // private mapServicePostToCardPost(p: ServicePost): CardPost {
  //   return {
  //     id: p.id,
  //     author: {
  //       name: p.authorName || 'Ẩn danh',
  //       avatarUrl: '/assets/images/avatar.jpg', // thay bằng avatar thật nếu API có
  //       verified: true
  //     },
  //     timeAgo: this.formatTimeAgo(p.createdAt),
  //     title: p.title,
  //     content: p.content,
  //     rating: 0,
  //     reviewCount: 0,
  //     tags: [],
  //     photos: p.postImg ? [p.postImg] : [],
  //     trip: { title: p.title || 'Chia sẻ hành trình', meta: '' },
  //     stats: { likes: 0, comments: 0, shares: 0, saves: 0 },
  //     liked: false,
  //     saved: false
  //   };
  // }
  private mapServicePostToCardPost(p: ServicePost): CardPost {
  // 1) Nếu backend đã trả images[]
  let photoList: string[] | undefined = (p as any).images;

  // 2) Nếu chưa có, thử decode từ postImg:
  if (!photoList || photoList.length === 0) {
    const raw = p.postImg?.trim();

    if (raw?.startsWith('[')) {
      // JSON array string
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          photoList = arr.filter(Boolean);
        }
      } catch {}
    } else if (raw?.includes('|')) {
      // Delimiter '|'
      photoList = raw.split('|').map(s => s.trim()).filter(Boolean);
    } else if (raw) {
      // 1 ảnh đơn
      photoList = [raw];
    } else {
      photoList = [];
    }
  }

  return {
    id: p.id,
    author: {
      name: p.authorName || 'Ẩn danh',
      avatarUrl: '/assets/images/avatar.jpg',
      verified: true
    },
    timeAgo: this.formatTimeAgo(p.createdAt),
    title: p.title,
    content: p.content,
    rating: 0,
    reviewCount: 0,
    tags: [],
    photos: photoList,
    trip: { title: p.title || 'Chia sẻ hành trình', meta: '' },
    stats: {  likes: (p as any).likeCount ?? 0, comments: (p as any).totalComment, shares: 0, saves: 0 },
    liked: false,
    saved: false
  };
}


  private formatTimeAgo(date: Date | string): string {
    const t = new Date(date).getTime();
    if (Number.isNaN(t)) return 'vừa xong';
    const diffMs = Date.now() - t;
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `${sec}s trước`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} phút trước`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} ngày trước`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} tháng trước`;
    const y = Math.floor(mo / 12);
    return `${y} năm trước`;
  }

  trackByPostId(_: number, p: CardPost) { return p.id; }

  onSave(ev: any) { console.log('Save', ev); }
  onLike(card: CardPost) {
    this.socialService.addReaction(card.id, 'Like').subscribe({
      next: () => {
        // UI đã tăng/giảm lạc quan trong child rồi (toggleLike), không cộng ở đây nữa
        // Nếu muốn rollback khi lỗi thì xử lý trong error
      },
      error: err => {
        console.error('addReaction error:', err);
        // rollback lạc quan nếu cần
        if (card.liked && card.stats) {
          card.liked = false;
          card.stats.likes = Math.max(0, card.stats.likes - 1);
        }
      }
    });
  }


  onPreviewErr(e: Event) {
    const img = e.target as HTMLImageElement;
    img.onerror = null; // tránh vòng lặp
    img.src = '/assets/images/image-placeholder.jpg';
  }

  // ===== NEW: chọn/xoá ảnh =====
  onFilesSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files);

    // optional: giới hạn 10 ảnh
    const canAdd = Math.max(0, 10 - this.selectedFiles.length);
    const toAdd = files.slice(0, canAdd);

    toAdd.forEach(f => {
      this.selectedFiles.push(f);
      const url = URL.createObjectURL(f);
      this.previewUrls.push(url);
    });

    // reset input để lần sau vẫn trigger change
    input.value = '';
  }

  removeSelectedImage(i: number) {
    URL.revokeObjectURL(this.previewUrls[i]);
    this.previewUrls.splice(i, 1);
    this.selectedFiles.splice(i, 1);
  }

  // ===== submit: upload -> lấy URL -> createPost =====
  async submitPost() {
    if (this.isSubmitting) return;

    const title = (this.newPost.title || '').trim();
    const content = (this.newPost.content || '').trim();
    if (!title || !content) return;

    this.isSubmitting = true;

    try {
      // 1) Upload các file đã chọn (Bearer auth được gắn trong service)
      const uploadedUrls: string[] = [];
      for (const file of this.selectedFiles) {
        const res = await firstValueFrom(this.socialService.uploadImage(file));
        uploadedUrls.push(res.url); // backend trả { url: string }
      }

      // // 2) Quy ước: nếu user có dán URL tay -> ưu tiên URL tay,
      // // nếu không -> dùng ảnh đầu tiên vừa upload (nếu có)
      // const manualUrl = this.newPost.postImg?.trim();
      // const postImg = manualUrl || uploadedUrls[0] || '';
      // Gom tất cả URL: ưu tiên URL nhập tay đứng đầu
    const manual = this.newPost.postImg?.trim();
    const allUrls = [
      ...(manual ? [manual] : []),
      ...uploadedUrls
    ].filter(Boolean);

    // CHỌN 1 TRONG 2 CÁCH ENCODE (mình khuyến nghị JSON):
    // Cách A (khuyến nghị): JSON array string
    const postImgPayload = JSON.stringify(allUrls);
    // Cách B: chuỗi có delimiter '|'
    // const postImgPayload = allUrls.join('|');

      // 3) Tạo post (backend hiện nhận 1 ảnh duy nhất 'postImg')
      const created = await firstValueFrom(
        this.socialService.createPost({ title, content, postImg: postImgPayload })
      );

      // 4) Update UI
      const card = this.mapServicePostToCardPost(created);
      this.posts = [card, ...this.posts];

      // 5) Reset form + preview + đóng modal
     

   
     Swal.fire({ title: 'Đăng bài thành công!', icon: 'success', timer: 10000 });
      this.newPost = { title: '', content: '', postImg: '' };
      this.previewUrls.forEach(u => URL.revokeObjectURL(u));
      this.previewUrls = [];
      this.selectedFiles = [];
     this.closeComposer();
    } catch (err) {
      console.error('Create post failed:', err);
      alert('Đăng bài thất bại. Vui lòng thử lại!');
    } finally {
      this.isSubmitting = false;
    }

   
  }
  
isCommentsOpen = false;
commentsPost?: CardPost;
commentsPostId = '';                         // [THÊM]

openComments(p: CardPost) {
  this.commentsPost = p;
  this.commentsPostId = (p.id || '').trim(); // [THÊM] cắt trắng
  this.isCommentsOpen = true;
}

closeComments() {
  this.isCommentsOpen = false;
  this.commentsPost = undefined;
  this.commentsPostId = '';
}

}
