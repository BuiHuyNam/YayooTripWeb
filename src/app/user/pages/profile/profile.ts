import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-profile',
  imports: [NgIf, NgFor, FormsModule, DecimalPipe, DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile {
  isOwnProfile = true;
  isFollowing = false;
  activeTab: 'posts' | 'itineraries' | 'followers' | 'following' = 'posts';

  mockUser = {
    id: '1',
    name: 'Minh Anh',
    username: '@minhanh_travel',
    avatar: './assets/generic-user-avatar.png',
    coverImage: './assets/sapa-terraced-rice-fields-mountains-vietnam.png',
    bio: 'Yêu thích khám phá những vùng đất mới, chia sẻ những trải nghiệm du lịch tuyệt vời. Đã đi qua 15 tỉnh thành Việt Nam và vẫn đang tiếp tục hành trình khám phá.',
    location: 'Hà Nội, Việt Nam',
    joinDate: 'Tham gia từ tháng 3, 2023',
    verified: true,
    stats: {
      posts: 24,
      followers: 1250,
      following: 340,
      itineraries: 12,
      placesVisited: 15,
      totalLikes: 2840,
    },
    achievements: [
      { id: '1', name: 'Khám phá miền Bắc', icon: '🏔️', description: 'Đã đến 5 tỉnh miền Bắc' },
      { id: '2', name: 'Người chia sẻ', icon: '📝', description: 'Đã đăng 20+ bài viết' },
      { id: '3', name: 'Được yêu thích', icon: '❤️', description: 'Nhận 1000+ lượt thích' },
    ],
  };

  mockPosts = [
    {
      id: 'p1',
      author: { name: 'Minh Anh', avatar: '/assets/user-1.jpg', verified: true },
      location: 'Sapa, Lào Cai',
      timestamp: '2 ngày trước',
      content: 'Vừa trở về từ chuyến đi Sapa 3 ngày 2 đêm tuyệt vời! Thời tiết mát mẻ, cảnh đẹp như tranh vẽ.',
      images: ['./assets/sapa-terraced-rice-fields-mountains-vietnam.png'],
      tags: ['Sapa', 'RuộngBậcThang'],
      likes: 45, comments: 12, shares: 6,
      saved: false,
    }
  ];

  mockItineraries = [
    {
      id: '1',
      title: 'Khám phá Sapa 3 ngày 2 đêm',
      description: 'Lịch trình chi tiết khám phá Sapa với ruộng bậc thang, thác Bạc và chợ tình Sapa',
      image: './assets/sapa-terraced-rice-fields-mountains-vietnam.png',
      duration: '3 ngày 2 đêm',
      budget: '2.500.000 VNĐ',
      likes: 89,
      comments: 156,   // sửa từ saves -> comments để hiển thị đúng số bình luận
      views: 1240,
      isPublic: true,
      createdAt: '1 tuần trước',
    },
    {
      id: '2',
      title: 'Hội An cổ kính 2 ngày 1 đêm',
      description: 'Trải nghiệm phố cổ Hội An với đèn lồng, ẩm thực và văn hóa truyền thống',
      image: './assets/hoi-an-ancient-town-lanterns-vietnam.png',
      duration: '2 ngày 1 đêm',
      budget: '1.800.000 VNĐ',
      likes: 67,
      comments: 123,   // sửa từ saves -> comments
      views: 890,
      isPublic: true,
      createdAt: '2 tuần trước',
    },
  ];

  toggleFollow() {
    this.isFollowing = !this.isFollowing;
  }
  // --- STATE FORM CHỈNH SỬA ---
  showEdit = false;
  editModel: any = null;

  openEdit() {
    // tạo bản nháp để chỉnh (tránh sửa trực tiếp)
    const { stats, achievements, ...shallow } = this.mockUser;
    this.editModel = { ...shallow }; // các field người dùng chỉnh
    this.showEdit = true;
  }

  closeEdit() {
    this.showEdit = false;
    this.editModel = null;
  }

  saveEdit() {
    // Map các field được phép chỉnh vào mockUser
    this.mockUser.name = this.editModel.name?.trim() || this.mockUser.name;
    this.mockUser.username = this.editModel.username?.trim() || this.mockUser.username;
    this.mockUser.bio = this.editModel.bio ?? this.mockUser.bio;
    this.mockUser.location = this.editModel.location ?? this.mockUser.location;
    this.mockUser.avatar = this.editModel.avatar || this.mockUser.avatar;
    this.mockUser.coverImage = this.editModel.coverImage || this.mockUser.coverImage;
    this.mockUser.verified = !!this.editModel.verified;

    this.closeEdit();
  }
  toggleSave(p: any) { p.saved = !p.saved; }
}
