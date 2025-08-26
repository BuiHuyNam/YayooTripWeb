import { Component } from '@angular/core';
import { DecimalPipe, DatePipe, NgFor, NgIf } from '@angular/common';

type UserStatus = 'active' | 'locked' | 'pending';

type User = {
  name: string;
  email: string;
  avatar: string;
  verified?: boolean;
  status: UserStatus;
  joinedAt: string | Date; // ISO hoặc Date đều được
  posts: number;
  itineraries: number;
  lastActive: string; // ví dụ: "2 giờ trước"
};

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [DecimalPipe, DatePipe, NgFor, NgIf],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement {
  // ------- Header -------
  title = 'Quản lý người dùng';
  subtitle = 'Quản lý tài khoản và hoạt động của người dùng';

  // ------- Mock stats (theo ảnh) -------
  cards = [
    { value: 8234, label: 'Người dùng hoạt động', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { value: 45, label: 'Tài khoản bị khóa', color: 'text-rose-600', bg: 'bg-rose-50' },
    { value: 123, label: 'Chờ duyệt', color: 'text-amber-600', bg: 'bg-amber-50' },
    { value: 234, label: 'Đăng ký hôm nay', color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  // ------- Bộ lọc -------
  search = '';
  statusFilter: 'all' | UserStatus = 'all';

  // ------- Dữ liệu người dùng (theo ảnh demo) -------
  users: User[] = [
    {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      avatar: 'https://i.pravatar.cc/100?img=1',
      verified: true,
      status: 'active',
      joinedAt: '2024-03-15',
      posts: 12,
      itineraries: 5,
      lastActive: '2 giờ trước',
    },
    {
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      avatar: 'https://i.pravatar.cc/100?img=2',
      status: 'locked',
      joinedAt: '2024-02-22',
      posts: 8,
      itineraries: 3,
      lastActive: '1 ngày trước',
    },
    {
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      avatar: 'https://i.pravatar.cc/100?img=3',
      status: 'pending',
      joinedAt: '2024-04-01',
      posts: 0,
      itineraries: 0,
      lastActive: '5 phút trước',
    },
    {
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      avatar: 'https://i.pravatar.cc/100?img=4',
      verified: true,
      status: 'active',
      joinedAt: '2024-01-10',
      posts: 25,
      itineraries: 12,
      lastActive: '30 phút trước',
    },
  ];

  // ------- View helpers -------
  get filteredUsers(): User[] {
    const q = this.search.trim().toLowerCase();
    return this.users.filter(u => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchStatus = this.statusFilter === 'all' || u.status === this.statusFilter;
      return matchQ && matchStatus;
    });
  }


  setSearch(v: string) {
    this.search = v;
  }

  setSearchFromEvent(event: Event) {
    const input = event.target as HTMLInputElement | null;
    this.setSearch(input?.value ?? '');
  }

  setStatus(v: string) {
    this.statusFilter = (v as any) || 'all';
  }

  setStatusFromEvent(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    this.setStatus(select?.value ?? 'all');
  }

  trackByEmail = (_: number, u: User) => u.email;

  statusBadgeClass(s: UserStatus) {
    switch (s) {
      case 'active': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
      case 'locked': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
    }
  }

  statusLabel(s: UserStatus) {
    return s === 'active' ? 'Hoạt động' : s === 'locked' ? 'Tạm khóa' : 'Chờ duyệt';
  }

  // Actions (demo)
  openUser(u: User) { console.log('open', u.email); }
  more(u: User, ev: MouseEvent) { ev.stopPropagation(); console.log('more...', u.email); }
}
