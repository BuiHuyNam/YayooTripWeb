import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { Router } from 'express';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { ProfileServiceTs, User, UpdateUserRequest, Schedule } from './service/profile.service.ts';
import { AuthService } from '../../../auth/auth.service.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  imports: [NgIf, NgFor, FormsModule, DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile {
  constructor(private profileService: ProfileServiceTs, private authService: AuthService, private zone: NgZone,
    private cdr: ChangeDetectorRef) { }
  isOwnProfile = true;
  isFollowing = false;
  activeTab: 'posts' | 'itineraries' | 'followers' | 'following' = 'posts';
  user: User | null = null;
  isLoading = false;
  hasError = false;

  // Schedule properties
  schedules: Schedule[] = [];
  schedulesLoading = false;
  schedulesError = false;
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
    const editable: UpdateUserRequest = {
      name: this.user?.name || '',
      email: this.user?.email || '',
      phone: this.user?.phone || '',
      password: localStorage.getItem('password') || '',
      avartaImage: this.user?.avartaImage || '',
      roleName: this.user?.roleName || 'User',
    };
    this.editModel = { ...editable };
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
  ngOnInit() {
    this.loadUserData();
    console.log(this.authService.getUserIdFromToken());
    console.log(localStorage.getItem('password'));
  }

  loadUserData() {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.hasError = false;

    this.profileService.getUser(userId).subscribe({
      next: (user: User) => {
        this.zone.run(() => {
          this.user = user;
          this.isLoading = false;
          localStorage.setItem('password', user.password);
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.zone.run(() => {
          this.hasError = true;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  getUsername(): string {
    if (!this.user?.name) return 'user';
    return this.user.name.toLowerCase().replace(/\s+/g, '_');
  }

  loadSchedules() {
    this.schedulesLoading = true;
    this.schedulesError = false;

    this.profileService.getAllSchedule().subscribe({
      next: (schedules: Schedule[]) => {
        this.zone.run(() => {
          this.schedules = schedules;
          this.schedulesLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        this.zone.run(() => {
          console.error('Error loading schedules:', error);
          this.schedulesError = true;
          this.schedulesLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onTabChange(tab: 'posts' | 'itineraries' | 'followers' | 'following') {
    this.activeTab = tab;
    if (tab === 'itineraries' && this.schedules.length === 0 && !this.schedulesLoading) {
      this.loadSchedules();
    }
  }

  getScheduleImage(schedule: Schedule): string {
    // Use mock images based on schedule type or name
    const mockImages = [
      './assets/sapa-terraced-rice-fields-mountains-vietnam.png',
      './assets/hoi-an-ancient-town-lanterns-vietnam.png',
      './assets/hoi-an-ancient-town-night-lanterns-vietnam.png',
      './assets/phu-quoc-island-beach-palm-trees-vietnam.png',
      './assets/phu-quoc-sunset-beach-coconut-trees-vietnam.png',
      './assets/da-lat-flower-gardens-pine-forests-vietnam.png',
      './assets/sapa-trekking-mountain-trail-vietnam.png'
    ];

    // Use a simple hash to consistently assign images
    const hash = schedule.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    return mockImages[Math.abs(hash) % mockImages.length];
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Nháp';
      case 1: return 'Công khai';
      case 2: return 'Riêng tư';
      default: return 'Không xác định';
    }
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (!this.editModel) this.editModel = {};
      this.editModel.avartaImage = base64;
    };
    reader.readAsDataURL(file);
  }

  updateUser() {
    const userId = this.user?.id || '';
    if (!userId) return;

    const payload: UpdateUserRequest = {
      name: this.editModel.name?.trim() || '',
      email: this.editModel.email?.trim() || '',
      phone: this.editModel.phone?.trim() || '',
      password: localStorage.getItem('password') || '',
      avartaImage: this.editModel.avartaImage || '',
      roleName: this.editModel.roleName || 'User',
    };

    this.isLoading = true;
    this.profileService.updateUser(userId, payload).subscribe({
      next: (user: User) => {
        this.user = user;
        // localStorage.setItem('password', payload.password || '');
        this.loadUserData();
        Swal.fire({
          title: 'Thành công',
          text: 'Người dùng đã được cập nhật',
          icon: 'success',
        });
        this.showEdit = false;
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.hasError = true;
        Swal.fire({
          title: 'Lỗi',
          text: 'Không thể cập nhật người dùng',
          icon: 'error',
        });
      },
      complete: () => {
        this.isLoading = false;
        Swal.fire({
          title: 'Thành công',
          text: 'Người dù đã được cập nhật',
          icon: 'success',
        });
      }
    });
  }
}
