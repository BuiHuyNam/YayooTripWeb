import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type Destination = {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
  duration: string;
  tags: string[];
};

type Itinerary = {
  id: number;
  title: string;
  author: { name: string; avatar?: string; verified?: boolean };
  destination: string;
  duration: string;
  participants: string;
  image: string;
  tags: string[];
  likes: number;
  comments: number;
  description: string;
  liked?: boolean;
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  query = '';
  destinations: Destination[] = [
    {
      id: 1,
      name: 'Sapa, Lào Cai',
      description: 'Ruộng bậc thang và núi non hùng vĩ của vùng Tây Bắc',
      image: './assets/sapa-terraced-rice-fields-mountains-vietnam.png',
      rating: 4.8,
      duration: '2-3 ngày',
      tags: ['Núi non', 'Ruộng bậc thang', 'Trekking'],
    },
    {
      id: 2,
      name: 'Hội An, Quảng Nam',
      description: 'Phố cổ với những chiếc đèn lồng rực rỡ và ẩm thực đặc sắc',
      image: '/assets/hoi-an-ancient-town-lanterns-vietnam.png',
      rating: 4.9,
      duration: '2-4 ngày',
      tags: ['Phố cổ', 'Ẩm thực', 'Văn hóa'],
    },
    {
      id: 3,
      name: 'Phú Quốc, Kiên Giang',
      description: 'Đảo ngọc với bãi biển xanh trong và hải sản tươi ngon',
      image: '/assets/phu-quoc-island-beach-palm-trees-vietnam.png',
      rating: 4.7,
      duration: '3-5 ngày',
      tags: ['Biển đảo', 'Hải sản', 'Nghỉ dưỡng'],
    },
    {
      id: 4,
      name: 'Đà Lạt, Lâm Đồng',
      description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm',
      image: '/assets/da-lat-flower-gardens-pine-forests-vietnam.png',
      rating: 4.6,
      duration: '2-3 ngày',
      tags: ['Hoa đà lạt', 'Khí hậu mát', 'Cà phê'],
    },
  ];

  itineraries: Itinerary[] = [
    {
      id: 1,
      title: 'Khám phá Sapa 3 ngày 2 đêm - Trekking và văn hóa',
      author: { name: 'Minh Anh', avatar: '/assets/young-vietnamese-woman-traveler.png', verified: true },
      destination: 'Sapa',
      duration: '3 ngày',
      participants: '2 người',
      image: '/assets/sapa-trekking-mountain-trail-vietnam.png',
      tags: ['Trekking', 'Văn hóa', 'Phượt'],
      likes: 124,
      comments: 23,
      description: 'Lịch trình chi tiết khám phá Sapa với trekking Fansipan và trải nghiệm văn hóa dân tộc...',
    },
    {
      id: 2,
      title: 'Hành trình khám phá Hội An - Đà Nẵng 4 ngày',
      author: { name: 'Tuấn Minh', avatar: '/assets/young-vietnamese-man-backpacker.png', verified: false },
      destination: 'Hội An',
      duration: '4 ngày',
      participants: '4 người',
      image: '/assets/hoi-an-ancient-town-night-lanterns-vietnam.png',
      tags: ['Phố cổ', 'Ẩm thực', 'Biển'],
      likes: 89,
      comments: 15,
      description: 'Khám phá phố cổ Hội An, thưởng thức ẩm thực địa phương và tắm biển Cửa Đại...',
    },
    {
      id: 3,
      title: 'Phú Quốc tự túc - Trải nghiệm đảo ngọc',
      author: { name: 'Thu Hà', avatar: '/assets/young-vietnamese-woman-beach-traveler.png', verified: true },
      destination: 'Phú Quốc',
      duration: '5 ngày',
      participants: '2 người',
      image: '/assets/phu-quoc-sunset-beach-coconut-trees-vietnam.png',
      tags: ['Biển đảo', 'Nghỉ dưỡng', 'Hải sản'],
      likes: 156,
      comments: 31,
      description: 'Lịch trình khám phá Phú Quốc với những bãi biển đẹp nhất và ẩm thực hải sản...',
    },
  ];

  // Trong class HomeComponent
  stats = [
    { icon: 'users', value: '50K+', label: 'Thành viên', color: 'text-primary-600' },
    { icon: 'map-pin', value: '1.4K+', label: 'Địa điểm', color: 'text-sky-600' },
    { icon: 'calendar', value: '8.5K+', label: 'Lịch trình', color: 'text-primary-600' },
    { icon: 'star', value: '125K+', label: 'Đánh giá', color: 'text-sky-600' },
    { icon: 'trending-up', value: '95%', label: 'Hài lòng', color: 'text-primary-600' },
    { icon: 'globe', value: '63', label: 'Tỉnh thành', color: 'text-sky-600' },
  ];

  trackByStatLabel = (_: number, s: { label: string }) => s.label;


  trackByItineraryId = (_: number, it: Itinerary) => it.id;

  toggleLike(it: Itinerary) {
    it.liked = !it.liked;
    it.likes += it.liked ? 1 : -1;
  }

  onSearch() {
    // TODO: gọi API tìm kiếm hoặc điều hướng
    console.log('Searching for:', this.query);
  }
}
