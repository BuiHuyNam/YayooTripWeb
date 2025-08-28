import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';

type NavKey = 'dashboard' | 'users' | 'map' | 'shield' | 'settings';
interface NavItem { name: string; href: string; icon: NavKey; }

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css'],
})
export class AdminLayout {
  sidebarOpen = false;
  userMenuOpen = false;
  router = inject(Router);

  navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Quản lý User', href: '/admin/users', icon: 'users' },
    { name: 'Quản lý Địa điểm', href: '/admin/destinations', icon: 'map' },
    { name: 'Quản lý Role', href: '/admin/roles', icon: 'shield' },
    { name: 'Quản lý Service', href: '/admin/services', icon: 'settings' },
  ];

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar() { this.sidebarOpen = false; }
  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }
  closeUserMenu() { this.userMenuOpen = false; }
  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('login');
    this.router.navigate(['/home']);
  }
}
