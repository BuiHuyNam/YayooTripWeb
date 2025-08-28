import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';

type Destination = { id: string; name: string; province: string; type: string };
type Service = { id: string; name: string; province: string; type: string; distanceKm: number };

type ScheduleItemBase = {
  id: string;
  refId: string;
  name: string;
  province?: string;
  startTime?: string;
  endTime?: string;
  estimatedCost?: string | number;
  gear?: string;
};

type AttachedService = {
  id: string;
  serviceId: string;
  name: string;
  startTime?: string;
  endTime?: string;
  estimatedCost?: string | number;
  distanceKm: number;
};

type DestinationItem = ScheduleItemBase & {
  kind: 'destination';
  attachedServices: AttachedService[];
};

type ServiceItem = ScheduleItemBase & {
  kind: 'service';
};

type ScheduleItem = DestinationItem | ServiceItem;

@Component({
  selector: 'app-create-itinerary',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-itinerary.html',
  styleUrls: ['./create-itinerary.css'],
})
export class CreateItinerary {
  constructor(private router: Router) {

  }

  // ----- Mock data -----
  PROVINCES = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Đà Lạt', 'Nha Trang'];
  DEST_TYPES = ['Tham quan', 'Thiên nhiên', 'Văn hoá', 'Ẩm thực'];
  SERVICE_TYPES = ['Vận chuyển', 'Lưu trú', 'Ăn uống', 'Vé tham quan', 'Tour'];

  MOCK_DESTINATIONS: Destination[] = [
    { id: 'd1', name: 'Phố cổ Hà Nội', province: 'Hà Nội', type: 'Văn hoá' },
    { id: 'd2', name: 'Hồ Gươm', province: 'Hà Nội', type: 'Tham quan' },
    { id: 'd3', name: 'Bà Nà Hills', province: 'Đà Nẵng', type: 'Thiên nhiên' },
    { id: 'd4', name: 'Kinh thành Huế', province: 'Huế', type: 'Văn hoá' },
    { id: 'd5', name: 'Thung lũng Tình Yêu', province: 'Đà Lạt', type: 'Thiên nhiên' },
    { id: 'd6', name: 'Biển Nha Trang', province: 'Nha Trang', type: 'Thiên nhiên' },
  ];

  MOCK_SERVICES: Service[] = [
    { id: 's1', name: 'Khách sạn Hồ Gươm 3*', province: 'Hà Nội', type: 'Lưu trú', distanceKm: 1.2 },
    { id: 's2', name: 'Taxi Nội Bài ↔ Trung tâm', province: 'Hà Nội', type: 'Vận chuyển', distanceKm: 26 },
    { id: 's3', name: 'Vé cáp treo Bà Nà', province: 'Đà Nẵng', type: 'Vé tham quan', distanceKm: 0.5 },
    { id: 's4', name: 'Resort ven biển', province: 'Nha Trang', type: 'Lưu trú', distanceKm: 2.4 },
    { id: 's5', name: 'Bún bò Huế Cô Ba', province: 'Huế', type: 'Ăn uống', distanceKm: 0.8 },
    { id: 's6', name: 'Tour City Hà Nội nửa ngày', province: 'Hà Nội', type: 'Tour', distanceKm: 3.1 },
  ];

  // ----- Helpers -----
  private uid = () => Math.random().toString(36).slice(2);
  cn = (...cls: Array<string | false | null | undefined>) => cls.filter(Boolean).join(' ');

  // ----- Form state -----
  name = 'Lịch trình mới';
  startDate = '';
  endDate = '';

  items: ScheduleItem[] = [];
  selectedItemId: string | null = null;

  get selectedItem(): ScheduleItem | null {
    return this.items.find(i => i.id === this.selectedItemId) || null;
  }

  // ----- Add chooser modal -----
  showAddChooser = false;
  addMode: 'destination' | 'service' | null = null;

  // Destination filters
  filterProvince = '';
  filterDestType = '';
  filterKeyword = '';

  // Service filters
  serviceType = '';
  serviceDistance = 10;
  serviceProvince = '';
  serviceStart = '';
  serviceEnd = '';

  get filteredDestinations(): Destination[] {
    return this.MOCK_DESTINATIONS.filter(d =>
      (!this.filterProvince || d.province === this.filterProvince) &&
      (!this.filterDestType || d.type === this.filterDestType) &&
      (!this.filterKeyword || d.name.toLowerCase().includes(this.filterKeyword.toLowerCase()))
    );
  }

  get filteredServices(): Service[] {
    return this.MOCK_SERVICES.filter(s =>
      (!this.serviceProvince || s.province === this.serviceProvince) &&
      (!this.serviceType || s.type === this.serviceType) &&
      s.distanceKm <= this.serviceDistance
    );
  }

  updateAttachedServiceEstimatedCost(itemId: string, attId: string, value: any) {
    this.items = this.items.map(i =>
      i.id === itemId
        ? {
          ...i,
          attachedServices: (i as any).attachedServices.map((a: any) =>
            a.id === attId ? { ...a, estimatedCost: value } : a
          ),
        }
        : i
    );
  }

  updateAttachedServiceEndTime(itemId: string, attId: string, value: any) {
    this.items = this.items.map(i =>
      i.id === itemId
        ? {
          ...i,
          attachedServices: (i as any).attachedServices.map((a: any) =>
            a.id === attId ? { ...a, endTime: value } : a
          ),
        }
        : i
    );
  }

  updateAttachedServiceStartTime(itemId: string, attId: string, value: any) {
    this.items = this.items.map(i =>
      i.id === itemId
        ? {
          ...i,
          attachedServices: (i as any).attachedServices.map((a: any) =>
            a.id === attId ? { ...a, startTime: value } : a
          ),
        }
        : i
    );
  }

  updateEstimatedCost(id: string, value: any) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, estimatedCost: value } : item
    );
  }

  updateStartTime(id: string, value: any) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, startTime: value } : item
    );
  }

  updateEndTime(id: string, value: any) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, endTime: value } : item
    );
  }

  // ----- Actions -----
  addDestinationAsItem(dest: Destination) {
    const it: DestinationItem = {
      id: this.uid(),
      kind: 'destination',
      refId: dest.id,
      name: dest.name,
      province: dest.province,
      startTime: '',
      endTime: '',
      estimatedCost: '',
      gear: '',
      attachedServices: [],
    };
    this.items = [...this.items, it];
    this.selectedItemId = it.id;
    this.closeAllAddPanels();
  }

  addServiceAsItem(svc: Service, withTimes = true) {
    const it: ServiceItem = {
      id: this.uid(),
      kind: 'service',
      refId: svc.id,
      name: svc.name,
      province: svc.province,
      startTime: withTimes ? this.serviceStart : '',
      endTime: withTimes ? this.serviceEnd : '',
      estimatedCost: '',
      gear: '',
    };
    this.items = [...this.items, it];
    this.selectedItemId = it.id;
    this.closeAllAddPanels();
  }

  removeItem(id: string) {
    this.items = this.items.filter(i => i.id !== id);
    if (this.selectedItemId === id) this.selectedItemId = null;
  }

  updateSelected(patch: Partial<ScheduleItem>) {
    if (!this.selectedItem) return;
    this.items = this.items.map(i => (i.id === this.selectedItem!.id ? { ...i, ...patch } as ScheduleItem : i));
  }

  closeAllAddPanels() {
    this.showAddChooser = false;
    this.addMode = null;
    this.filterProvince = '';
    this.filterDestType = '';
    this.filterKeyword = '';
    this.serviceProvince = '';
    this.serviceType = '';
    this.serviceDistance = 10;
    this.serviceStart = '';
    this.serviceEnd = '';
  }

  saveDraft() {
    alert('[Demo] Đã lưu Nháp! (mock)');
  }
  completeItinerary() {
    alert('[Demo] Hoàn tất lịch trình! (mock)');
    this.router.navigate(['/itineraries/1']);

  }

  // ----- Attach service to destination item -----
  attachPanelOpen = false;
  attachServiceType = '';
  attachDistance = 5;

  get attachFiltered(): Service[] {
    const sel = this.selectedItem;
    if (!sel || sel.kind !== 'destination') return [];
    return this.MOCK_SERVICES.filter(s =>
      s.province === sel.province &&
      (!this.attachServiceType || s.type === this.attachServiceType) &&
      s.distanceKm <= this.attachDistance
    );
  }

  addAttachedService(svc: Service) {
    const sel = this.selectedItem;
    if (!sel || sel.kind !== 'destination') return;
    const att: AttachedService = {
      id: this.uid(),
      serviceId: svc.id,
      name: svc.name,
      distanceKm: svc.distanceKm,
      startTime: '',
      endTime: '',
      estimatedCost: '',
    };
    this.items = this.items.map(i => {
      if (i.id !== sel.id) return i;
      const dest = i as DestinationItem;
      return { ...dest, attachedServices: [...(dest.attachedServices || []), att] };
    });
  }

  removeAttachedService(attId: string) {
    const sel = this.selectedItem;
    if (!sel || sel.kind !== 'destination') return;
    this.items = this.items.map(i => {
      if (i.id !== sel.id) return i;
      const dest = i as DestinationItem;
      return { ...dest, attachedServices: (dest.attachedServices || []).filter(a => a.id !== attId) };
    });
  }
}
