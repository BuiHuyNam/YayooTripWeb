import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   query = '';

  onSearch() {
    // TODO: gọi API tìm kiếm hoặc điều hướng
    console.log('Searching for:', this.query);
  }
}
