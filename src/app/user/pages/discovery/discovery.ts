import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationCardComponent, LocationItem } from '../../components/location-card';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationMapComponent } from '../../components/location-map';
import { UserService } from '../../user.service';
import { LocationDetail } from '../location-detail/location-detail';
import { ChangeDetectorRef, NgZone } from '@angular/core';


export type ViewMode = 'list' | 'map';
export interface Category { id: string; name: string; }
export interface PriceRange { id: string; name: string; min?: number; max?: number; }

@Component({
  selector: 'app-discovery',
  standalone: true, 
  imports: [CommonModule, FormsModule, LocationCardComponent, LocationMapComponent, LocationDetail],
  templateUrl: './discovery.html',
  styleUrl: './discovery.css'
})
export class Discovery {
 
@Input() title = 'Khám phá địa điểm';
  @Input() subtitle = 'Tìm kiếm và khám phá những địa điểm tuyệt vời xung quanh bạn';

  @Input() viewMode: ViewMode = 'list';
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  @Input() searchQuery = '';
  @Output() searchQueryChange = new EventEmitter<string>();

  @Input() selectedCategory = 'all';
  @Output() selectedCategoryChange = new EventEmitter<string>();

  @Input() selectedPriceRange = 'all';
  @Output() selectedPriceRangeChange = new EventEmitter<string>();

  @Input() categories: Category[] = [];
  @Input() priceRanges: PriceRange[] = [];

  @Input() resultsCount = 0;


// ---- state ----
  locations: LocationItem[] = [];
  loading = false;
  errorMsg = '';

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchLocations();
  }

fetchLocations() {
  this.loading = true;
  this.errorMsg = '';
  this.userService.getLocations().subscribe({
    next: (data: LocationItem[]) => {   
      this.zone.run(() => {        // 👈 thêm kiểu ở đây
      this.locations = data;
      this.resultsCount = data.length;          // hoặc dùng biến cục bộ, xem mục 3
      this.loading = false;
      this.cdr.detectChanges();
      });
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Không thể tải danh sách địa điểm.';
      this.loading = false;
    }
  });
}




  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }

  clearCategory() {
    this.selectedCategory = 'all';
    this.selectedCategoryChange.emit('all');
  }

  clearPrice() {
    this.selectedPriceRange = 'all';
    this.selectedPriceRangeChange.emit('all');
  }

  // Modal state
 isDetailOpen = false;
  selectedId: string | null = null;
  selectedLocation: LocationItem | null = null; 

  onSelect(loc: LocationItem) {
    this.selectedId = loc.id;   
    console.log(loc.id);
    this.selectedLocation = loc;
    this.isDetailOpen = true;
  }
  closeDetail() {
    this.isDetailOpen = false;
  }

@HostListener('document:keydown', ['$event'])
onKeydown(e: KeyboardEvent | Event) {
  const ke = e as KeyboardEvent;
  if (ke.key === 'Escape' && this.isDetailOpen) this.closeDetail();
}



// locations = [{
//   id: 'h1',
//   name: 'Sapa Luxury Hotel',
//   categoryId: 'hotel',
//   categoryName: 'Khách sạn',
//   price: 1_200_000,
//   address: 'Sa Pa, Lào Cai',
//   lat: 22.335, lng: 103.843,
//   thumbnailUrl: '/assets/images/sapa-hotel.jpg',
//   rating: 4.7,
//   reviewCount: 856,
//   distanceKm: 0.5,
//   description: 'Khách sạn sang trọng với view ruộng bậc thang tuyệt đẹp',
//   amenities: ['Spa', 'Nhà hàng', 'Gym', 'Hồ bơi']
// },

// {
//   id: 'h2',
//   name: 'Sapa Luxury Hotel',
//   categoryId: 'hotel',
//   categoryName: 'Khách sạn',
//   price: 1_200_000,
//   address: 'Sa Pa, Lào Cai',
//   lat: 22.335, lng: 103.843,
//   thumbnailUrl: '/assets/images/sapa-hotel.jpg',
//   rating: 4.7,
//   reviewCount: 856,
//   distanceKm: 0.5,
//   description: 'Khách sạn sang trọng với view ruộng bậc thang tuyệt đẹp',
//   amenities: ['Spa', 'Nhà hàng', 'Gym', 'Hồ bơi']
// }];


  // onSelect(loc: LocationItem) {
  //   console.log('Selected:', loc);
  // }
  

  

}
