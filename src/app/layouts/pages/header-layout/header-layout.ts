import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-header-layout',
  imports: [CommonModule, RouterModule, FormsModule, RouterLink],
  templateUrl: './header-layout.html',
  styleUrl: './header-layout.css'
})
export class HeaderLayout implements OnInit {
  menuOpen = false;
  login = false;


  ngOnInit(): void {
    const token = localStorage.getItem('login');
    this.login = !!token;   // có token => đã login
  }

  constructor(private eRef: ElementRef) {
    // console.log(localStorage.getItem('login'))

  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('login');
    this.login = false;
  }

  // Đóng menu khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.eRef.nativeElement.contains(ev.target)) this.menuOpen = false;
  }

  // Đóng menu khi nhấn ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    this.menuOpen = false;
  }
}
