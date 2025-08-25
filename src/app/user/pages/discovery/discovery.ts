import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationCardComponent, LocationItem } from '../../components/location-card';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationMapComponent } from '../../components/location-map';


export type ViewMode = 'list' | 'map';
export interface Category { id: string; name: string; }
export interface PriceRange { id: string; name: string; min?: number; max?: number; }

@Component({
  selector: 'app-discovery',
  standalone: true, 
  imports: [CommonModule, FormsModule, LocationCardComponent, LocationMapComponent],
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


locations = [{
  id: 'h1',
  name: 'Sapa Luxury Hotel',
  categoryId: 'hotel',
  categoryName: 'Khách sạn',
  price: 1_200_000,
  address: 'Sa Pa, Lào Cai',
  lat: 22.335, lng: 103.843,
  thumbnailUrl: '/assets/images/sapa-hotel.jpg',
  rating: 4.7,
  reviewCount: 856,
  distanceKm: 0.5,
  description: 'Khách sạn sang trọng với view ruộng bậc thang tuyệt đẹp',
  amenities: ['Spa', 'Nhà hàng', 'Gym', 'Hồ bơi']
},

{
  id: 'h2',
  name: 'Sapa Luxury Hotel',
  categoryId: 'hotel',
  categoryName: 'Khách sạn',
  price: 1_200_000,
  address: 'Sa Pa, Lào Cai',
  lat: 22.335, lng: 103.843,
  thumbnailUrl: '/assets/images/sapa-hotel.jpg',
  rating: 4.7,
  reviewCount: 856,
  distanceKm: 0.5,
  description: 'Khách sạn sang trọng với view ruộng bậc thang tuyệt đẹp',
  amenities: ['Spa', 'Nhà hàng', 'Gym', 'Hồ bơi']
}];


  onSelect(loc: LocationItem) {
    console.log('Selected:', loc);
  }
  

  

}
