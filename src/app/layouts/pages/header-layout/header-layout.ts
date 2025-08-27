import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-header-layout',
  imports: [CommonModule, RouterModule, FormsModule, RouterLink],
  templateUrl: './header-layout.html',
  styleUrl: './header-layout.css'
})
export class HeaderLayout {


  menuOpen = false;

  constructor(private eRef: ElementRef, private router: Router) { }



  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu() {
    this.menuOpen = false;
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
