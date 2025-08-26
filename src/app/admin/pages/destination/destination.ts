import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

type Status = 'active' | 'inactive';

type Destination = {
  id: string;
  name: string;
  province: string;
  imageUrl: string;
  rating: number;      // 4.6
  reviews: number;     // 1567
  itineraries: number; // 98
  featured: boolean;   // nổi bật
  status: Status;      // active/inactive
  description?: string;
  tags?: string[];     // ["Biển", "Nghỉ dưỡng"]
};

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgFor, NgIf],
  templateUrl: './destination.html',
  styleUrls: ['./destination.css'],
})
export class Destinations {
  // ---------- Mock list (giống hình) ----------
  destinations: Destination[] = [
    {
      id: 'sapa',
      name: 'Sapa',
      province: 'Lào Cai',
      imageUrl: 'https://images.unsplash.com/photo-1543248939-ff40856f65d4?q=80&w=1600&auto=format&fit=crop',
      rating: 4.8, reviews: 2340, itineraries: 156,
      featured: true, status: 'active',
      tags: ['Ruộng bậc thang', 'Trekking']
    },
    {
      id: 'hoian',
      name: 'Hội An',
      province: 'Quảng Nam',
      imageUrl: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1600&auto=format&fit=crop',
      rating: 4.7, reviews: 1890, itineraries: 134,
      featured: true, status: 'active',
      tags: ['Phố cổ', 'Ẩm thực']
    },
    {
      id: 'phuquoc',
      name: 'Phú Quốc',
      province: 'Kiên Giang',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
      rating: 4.6, reviews: 1567, itineraries: 98,
      featured: false, status: 'active',
      tags: ['Biển', 'Nghỉ dưỡng']
    },
  ];

  // ---------- Tìm kiếm ----------
  q = '';
  get filtered(): Destination[] {
    const query = this.q.trim().toLowerCase();
    return this.destinations.filter(d =>
      !query ||
      d.name.toLowerCase().includes(query) ||
      d.province.toLowerCase().includes(query)
    );
  }

  // ---------- Form modal ----------
  showForm = true;
  isEditing = false;
  provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Đà Lạt', 'Nha Trang', 'Quảng Nam', 'Lào Cai', 'Kiên Giang'];

  form: Destination = this.empty();

  empty(): Destination {
    return {
      id: '',
      name: '',
      province: '',
      imageUrl: '',
      rating: 4.5,
      reviews: 0,
      itineraries: 0,
      featured: false,
      status: 'active',
      description: '',
      tags: [],
    };
  }

  openCreate() {
    this.isEditing = false;
    this.form = this.empty();
    this.showForm = true;
  }

  openEdit(d: Destination) {
    this.isEditing = true;
    this.form = JSON.parse(JSON.stringify(d));
    this.showForm = true;
  }

  save() {
    // chuẩn hoá tags theo input chuỗi
    if (typeof (this as any).tagsInput === 'string') {
      const raw = (this as any).tagsInput as string;
      this.form.tags = raw.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (this.isEditing) {
      this.destinations = this.destinations.map(d => d.id === this.form.id ? { ...this.form } : d);
    } else {
      // tạo id đơn giản từ tên
      this.form.id = (this.form.name || 'dest').toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      this.destinations = [{ ...this.form }, ...this.destinations];
    }
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
    (this as any).tagsInput = (this.form.tags || []).join(', ');
  }

  remove(d: Destination, ev?: MouseEvent) {
    ev?.stopPropagation();
    if (confirm(`Xoá điểm đến "${d.name}"?`)) {
      this.destinations = this.destinations.filter(x => x.id !== d.id);
    }
  }

  duplicate(d: Destination, ev?: MouseEvent) {
    ev?.stopPropagation();
    const copy = { ...d, id: d.id + '-' + Math.random().toString(36).slice(2), name: d.name + ' (bản sao)' };
    this.destinations = [copy, ...this.destinations];
  }

  toggleFeatured(d: Destination, ev?: MouseEvent) {
    ev?.stopPropagation();
    d.featured = !d.featured;
  }

  // giữ input tags ở dạng chuỗi cho form
  get tagsInput(): string {
    return (this.form.tags || []).join(', ');
  }
  set tagsInput(v: string) {
    (this as any).tagsInput = v;
  }

  trackById = (_: number, d: Destination) => d.id;
}
