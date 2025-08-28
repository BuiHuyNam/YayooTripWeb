import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { User, UserManagementService } from '../../services/user-management.service';
import { HttpClient, HttpClientModule, HttpContext } from '@angular/common/http';

type UserStatus = 'active' | 'locked' | 'pending';

// type User = {
//   name: string;
//   email: string;
//   avatar: string;
//   verified?: boolean;
//   status: UserStatus;
//   joinedAt: string | Date; // ISO hoặc Date đều được
//   posts: number;
//   itineraries: number;
//   lastActive: string; // ví dụ: "2 giờ trước"
// };

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [DecimalPipe, DatePipe, NgFor, NgIf, HttpClientModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  // userService = inject(UserManagement)
  // ------- Header -------
  title = 'Quản lý người dùng';
  subtitle = 'Quản lý tài khoản và hoạt động của người dùng';

  // ------- Mock stats (theo ảnh) -------
  users: User[] = [];
  filteredUsers: any[] = [];

  search: string = "";
  statusFilter: string = "all";

  cards = [
    { label: "Người dùng", value: 0, color: "text-sky-600", bg: "bg-sky-100" },
    { label: "Địa điểm", value: 0, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Đơn đặt", value: 0, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Doanh thu", value: 0, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  constructor(private userService: UserManagementService) { }
  // ------- View helpers -------
  filteredUserss(): User[] {
    const q = this.search.trim().toLowerCase();
    return this.users.filter(u => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchStatus = this.statusFilter === 'all';
      return matchQ && matchStatus;
    });
  }

  ngOnInit(): void {
    this.userService.loadData().subscribe({
      next: (data) => {
        console.log(data)
        this.users = data;
        this.filteredUsers = this.filteredUserss();

        // cập nhật stat card
        this.cards[0].value = this.users.length;
      },
      error: (err) => console.error("Error fetching users:", err)
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

  // trackByEmail = (_: number, u: User) => u.email;

  // statusBadgeClass(s: UserStatus) {
  //   switch (s) {
  //     case 'active': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200';
  //     case 'locked': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
  //     case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
  //   }
  // }

  // statusLabel(s: UserStatus) {
  //   return s === 'active' ? 'Hoạt động' : s === 'locked' ? 'Tạm khóa' : 'Chờ duyệt';
  // }

  // Actions (demo)
  // openUser(u: User) { console.log('open', u.email); }
  // more(u: User, ev: MouseEvent) { ev.stopPropagation(); console.log('more...', u.email); }

  // // Lọc theo tên/email
  // setSearchFromEvent(event: any): void {
  //   this.search = event.target.value.toLowerCase();
  //   this.applyFilters();
  // }

  // Lọc theo trạng thái (demo)
  // setStatusFromEvent(event: any): void {
  //   this.statusFilter = event.target.value;
  //   this.applyFilters();
  // }

  // Hàm filter
  applyFilters(): void {
    this.filteredUsers = this.users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(this.search) ||
        u.email.toLowerCase().includes(this.search);

      const matchesStatus =
        this.statusFilter === "all" || u.roleName.toLowerCase() === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  // trackBy
  trackByEmail(index: number, user: User): string {
    return user.email;
  }

  // mở chi tiết user
  openUser(user: User): void {
    console.log("Clicked user:", user);
  }

  more(user: User, event: Event): void {
    event.stopPropagation();
    console.log("More actions for:", user);
  }

  // Badge class demo
  statusBadgeClass(status: string): string {
    switch (status) {
      case "Admin":
        return "bg-purple-100 text-purple-700";
      case "User":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  statusLabel(status: string): string {
    return status;
  }
}
