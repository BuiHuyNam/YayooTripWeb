import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, PostCardComponent } from '../../components/post-card';

@Component({
  selector: 'app-social',
  standalone: true,                 // ✅ cần vì bạn dùng `imports`
  imports: [CommonModule, PostCardComponent],
  templateUrl: './social.html',
  styleUrls: ['./social.css']       // ✅ key đúng là styleUrls (mảng)
})
export class Social {
  currentUser = {
    name: 'Minh Anh',
    avatarUrl: 'assets/images/avatar.jpg'
  };

  openComposer() {
    // TODO: mở modal hoặc điều hướng tới trang tạo bài viết
  }

   composerAvatars = [
    '/assets/images/avatar.jpg',
    '/assets/images/avatar2.jpg',
    '/assets/images/avatar3.jpg',
  ];

  // Dữ liệu fix cứng 1 bài giống mock
  posts: Post[] = [
    {
      id: 'p1',
      author: {
        name: 'Minh Anh',
        avatarUrl: '/assets/images/avatar.jpg',
        verified: true,
      },
      timeAgo: '2 giờ trước',
      title: 'Trải nghiệm tuyệt vời tại Sapa - 3 ngày khám phá vùng núi Tây Bắc',
      content:
        'Vừa trở về từ chuyến đi Sapa 3 ngày 2 đêm và cảm thấy thực sự hài lòng với lịch trình này. Thời tiết mát mẻ, cảnh đẹp và người dân địa phương rất thân thiện. Đặc biệt là việc trekking lên Fansipan thực sự là một trải nghiệm không thể quên!',
      rating: 4.8,
      reviewCount: 23,
      tags: ['Sapa', 'Fansipan', 'Cát Cát'],
      photos: [
        '/assets/images/avatar.jpg',
        '/assets/images/avatar.jpg',
        
      ],
      trip: {
        title: 'Khám phá Sapa 3 ngày 2 đêm - Trekking và văn hóa',
        meta: '3 ngày • 2.5 triệu VND',
      },
      stats: { likes: 234, comments: 45, shares: 12, saves: 6 },
      liked: false,
      saved: false,
    },
  ];

  // ✅ THÊM HAI HÀM NÀY (nếu template có cả (like))
  onSave(event: any) {
    console.log('Save clicked:', event);
  }

  onLike(event: any) {
    console.log('Like clicked:', event);
  }
}
