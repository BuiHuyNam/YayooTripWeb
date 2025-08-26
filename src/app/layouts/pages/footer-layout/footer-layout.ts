import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-layout',
  // standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer-layout.html',
  styleUrl: './footer-layout.css'
})
export class FooterLayout {

}
