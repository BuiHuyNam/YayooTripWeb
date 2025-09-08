import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../app.routes';
import { CreateItineraryServiceTs, ScheduleItem, Itinerary, AttachedService } from './service/create-itinerary.service.ts';
import { TravelPlace } from './service/create-itinerary.service.ts';
import { Service as ServiceType } from './service/create-itinerary.service.ts';

type Destination = { id: string; name: string; province: string; type: string };
type Service = { id: string; name: string; province: string; type: string; distanceKm: number };



type DestinationItem = ScheduleItem & {
  kind: 'destination';
  attachedServices: AttachedService[];
};

type ServiceItem = ScheduleItem & {
  kind: 'service';
};

type ScheduleItemAdd = DestinationItem | ServiceItem;

@Component({
  selector: 'app-create-itinerary',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-itinerary.html',
  styleUrls: ['./create-itinerary.css'],
})
export class CreateItinerary {
  constructor(private router: Router, private createItineraryService: CreateItineraryServiceTs) {

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
  TravelPlaces: TravelPlace[] = [];
  FilteredTravelPlaces: TravelPlace[] = [];
  // Services: Service[] = [];

  MOCK_SERVICES: Service[] = [
    { id: 's1', name: 'Khách sạn Hồ Gươm 3*', province: 'Hà Nội', type: 'Lưu trú', distanceKm: 1.2 },
    { id: 's2', name: 'Taxi Nội Bài ↔ Trung tâm', province: 'Hà Nội', type: 'Vận chuyển', distanceKm: 26 },
    { id: 's3', name: 'Vé cáp treo Bà Nà', province: 'Đà Nẵng', type: 'Vé tham quan', distanceKm: 0.5 },
    { id: 's4', name: 'Resort ven biển', province: 'Nha Trang', type: 'Lưu trú', distanceKm: 2.4 },
    { id: 's5', name: 'Bún bò Huế Cô Ba', province: 'Huế', type: 'Ăn uống', distanceKm: 0.8 },
    { id: 's6', name: 'Tour City Hà Nội nửa ngày', province: 'Hà Nội', type: 'Tour', distanceKm: 3.1 },
  ];
  Services: ServiceType[] = [];
  FilteredServices: ServiceType[] = [];
  // ----- Helpers -----
  private uid = () => Math.random().toString(36).slice(2);
  cn = (...cls: Array<string | false | null | undefined>) => cls.filter(Boolean).join(' ');

  // ----- Form state -----
  name = 'Lịch trình mới';
  startDate = '';
  endDate = '';

  items: ScheduleItem[] = [];
  selectedItemId: string | null = null;
  hasApiError = false;

  get selectedItem(): ScheduleItem | null {
    return this.items.find(i => (i.travelId === this.selectedItemId || i.accomodationId === this.selectedItemId)) || null;
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

  // updateAttachedServiceEstimatedCost(itemId: string, attId: string, value: any) {
  //   this.items = this.items.map(i =>
  //     i.id === itemId
  //       ? {
  //         ...i,
  //         attachedServices: (i as any).attachedServices.map((a: any) =>
  //           a.id === attId ? { ...a, estimatedCost: value } : a
  //         ),
  //       }
  //       : i
  //   );
  // }

  // updateAttachedServiceEndTime(itemId: string, attId: string, value: any) {
  //   this.items = this.items.map(i =>
  //     i.id === itemId
  //       ? {
  //         ...i,
  //         attachedServices: (i as any).attachedServices.map((a: any) =>
  //           a.id === attId ? { ...a, endTime: value } : a
  //         ),
  //       }
  //       : i
  //   );
  // }

  // updateAttachedServiceStartTime(itemId: string, attId: string, value: any) {
  //   this.items = this.items.map(i =>
  //     i.id === itemId
  //       ? {
  //         ...i,
  //         attachedServices: (i as any).attachedServices.map((a: any) =>
  //           a.id === attId ? { ...a, startTime: value } : a
  //         ),
  //       }
  //       : i
  //   );
  // }

  // updateEstimatedCost(id: string, value: any) {
  //   this.items = this.items.map(item =>
  //     item.id === id ? { ...item, estimatedCost: value } : item
  //   );
  // }

  // updateStartTime(id: string, value: any) {
  //   this.items = this.items.map(item =>
  //     item.id === id ? { ...item, startTime: value } : item
  //   );
  // }

  // updateEndTime(id: string, value: any) {
  //   this.items = this.items.map(item =>
  //     item.id === id ? { ...item, endTime: value } : item
  //   );
  // }

  // ----- Actions -----
  addDestinationAsItem(dest: TravelPlace) {
    const scheduleItem: ScheduleItem = {
      travelId: dest.id, // Sử dụng ID của destination làm travelId
      accomodationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      startTime: '2025-09-06T20:19:01.927Z',
      endTime: '2025-09-06T20:19:01.927Z',
      name: dest.name,
      address: dest.address,
      kind: 'destination',
      attachedServices: [],
    };
    this.items = [...this.items, scheduleItem];
    this.selectedItemId = dest.id;
    this.closeAllAddPanels();

    // Gọi API để tạo itinerary sau khi thêm item
    // this.createItinerary();
  }

  addServiceAsItem(svc: ServiceType) {
    const scheduleItem: ScheduleItem = {
      travelId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      accomodationId: svc.id, // Sử dụng ID của service làm accomodationId
      startTime: '2025-09-06T20:19:01.927Z',
      endTime: '2025-09-06T20:19:01.927Z',
      name: svc.name,
      address: svc.address,
      kind: 'service',
    };
    this.items = [...this.items, scheduleItem];
    this.selectedItemId = svc.id;
    this.closeAllAddPanels();

    // Gọi API để tạo itinerary sau khi thêm item
    // this.createItinerary();
  }

  removeItem(itemId: string) {
    this.items = this.items.filter(i => (i.travelId !== itemId && i.accomodationId !== itemId));
    if (this.selectedItemId === itemId) this.selectedItemId = null;
  }

  updateSelected(patch: Partial<ScheduleItem>) {
    if (!this.selectedItem) return;
    this.items = this.items.map(i => {
      if ((i.travelId === this.selectedItem!.travelId && i.travelId) ||
        (i.accomodationId === this.selectedItem!.accomodationId && i.accomodationId)) {
        return { ...i, ...patch };
      }
      return i;
    });
  }

  updateStartTime(itemId: string, value: any) {
    this.items = this.items.map(item => {
      if ((item.travelId === itemId && item.travelId) ||
        (item.accomodationId === itemId && item.accomodationId)) {
        return { ...item, startTime: value };
      }
      return item;
    });
  }

  updateEndTime(itemId: string, value: any) {
    this.items = this.items.map(item => {
      if ((item.travelId === itemId && item.travelId) ||
        (item.accomodationId === itemId && item.accomodationId)) {
        return { ...item, endTime: value };
      }
      return item;
    });
  }

  updateEstimatedCost(itemId: string, value: any) {
    this.items = this.items.map(item => {
      if ((item.travelId === itemId && item.travelId) ||
        (item.accomodationId === itemId && item.accomodationId)) {
        return { ...item, estimatedCost: value };
      }
      return item;
    });
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
    this.createItinerary()
    // this.router.navigate(['/itineraries/1']);
  }

  createItinerary() {
    const itinerary: Itinerary = {
      name: this.name,
      description: 'Lịch trình được tạo từ ứng dụng',
      status: 0,
      type: 'travel',
      items: this.items
    };

    this.createItineraryService.createItinerary(itinerary).subscribe({
      next: (response) => {
        console.log('Itinerary created successfully:', response);
        alert('✅ Lịch trình đã được tạo thành công!');
        // Xóa dữ liệu tạm thời sau khi tạo thành công
        this.clearTemporaryData();
      },
      error: (error) => {
        console.error('Error creating itinerary:', error);
        if (error.status === 503) {
          // Lưu dữ liệu tạm thời vào localStorage
          this.saveTemporaryData(itinerary);
          alert('⚠️ Backend server hiện không khả dụng. Dữ liệu đã được lưu tạm thời.');
        } else {
          alert('❌ Có lỗi xảy ra khi tạo lịch trình. Vui lòng thử lại sau.');
        }
      }
    });
  }

  saveTemporaryData(itinerary: Itinerary) {
    try {
      const tempData = {
        itinerary: itinerary,
        timestamp: new Date().toISOString(),
        retryCount: 0
      };
      localStorage.setItem('temp_itinerary', JSON.stringify(tempData));
    } catch (error) {
      console.error('Error saving temporary data:', error);
    }
  }

  clearTemporaryData() {
    try {
      localStorage.removeItem('temp_itinerary');
    } catch (error) {
      console.error('Error clearing temporary data:', error);
    }
  }

  retryFailedItinerary() {
    try {
      const tempData = localStorage.getItem('temp_itinerary');
      if (tempData) {
        const parsed = JSON.parse(tempData);
        parsed.retryCount = (parsed.retryCount || 0) + 1;

        if (parsed.retryCount <= 3) {
          this.createItineraryService.createItinerary(parsed.itinerary).subscribe({
            next: (response) => {
              console.log('Retry successful:', response);
              alert('✅ Lịch trình đã được tạo thành công sau khi thử lại!');
              this.clearTemporaryData();
            },
            error: (error) => {
              console.error('Retry failed:', error);
              localStorage.setItem('temp_itinerary', JSON.stringify(parsed));
              alert(`❌ Thử lại lần ${parsed.retryCount} thất bại. Vui lòng thử lại sau.`);
            }
          });
        } else {
          alert('❌ Đã thử lại quá nhiều lần. Vui lòng liên hệ hỗ trợ.');
        }
      } else {
        alert('ℹ️ Không có dữ liệu tạm thời để thử lại.');
      }
    } catch (error) {
      console.error('Error retrying failed itinerary:', error);
      alert('❌ Có lỗi xảy ra khi thử lại.');
    }
  }

  // ----- Attach service to destination item -----
  attachPanelOpen = false;
  attachServiceType = '';
  attachDistance = 5;

  get attachFiltered(): ServiceType[] {
    const sel = this.selectedItem;
    if (!sel || !sel.travelId) return [];
    return this.FilteredServices.filter(s =>
      (!this.attachServiceType || s.position === this.attachServiceType) &&
      s.status == 1
    );
  }

  addAttachedService(svc: ServiceType) {
    const sel = this.selectedItem;
    if (!sel || !sel.travelId) return;
    const att: AttachedService = {
      id: this.uid(),
      serviceId: svc.id,
      name: svc.name,
      distanceKm: svc.status || 0,
      startTime: '',
      endTime: '',
      estimatedCost: '',
    };
    this.items = this.items.map(i => {
      if (i.travelId !== sel.travelId) return i;
      return { ...i, attachedServices: [...(i.attachedServices || []), att] };
    });
  }

  removeAttachedService(attId: string) {
    const sel = this.selectedItem;
    if (!sel || !sel.travelId) return;
    this.items = this.items.map(i => {
      if (i.travelId !== sel.travelId) return i;
      return { ...i, attachedServices: (i.attachedServices || []).filter(a => a.id !== attId) };
    });
  }

  updateAttachedServiceStartTime(itemId: string, attId: string, value: any) {
    this.items = this.items.map(i => {
      if ((i.travelId !== itemId && i.accomodationId !== itemId) || !i.attachedServices) return i;
      return {
        ...i,
        attachedServices: i.attachedServices.map(a =>
          a.id === attId ? { ...a, startTime: value } : a
        )
      };
    });
  }

  updateAttachedServiceEndTime(itemId: string, attId: string, value: any) {
    this.items = this.items.map(i => {
      if ((i.travelId !== itemId && i.accomodationId !== itemId) || !i.attachedServices) return i;
      return {
        ...i,
        attachedServices: i.attachedServices.map(a =>
          a.id === attId ? { ...a, endTime: value } : a
        )
      };
    });
  }

  updateAttachedServiceEstimatedCost(itemId: string, attId: string, value: any) {
    this.items = this.items.map(i => {
      if ((i.travelId !== itemId && i.accomodationId !== itemId) || !i.attachedServices) return i;
      return {
        ...i,
        attachedServices: i.attachedServices.map(a =>
          a.id === attId ? { ...a, estimatedCost: value } : a
        )
      };
    });
  }


  loadTravelPlaces() {
    this.createItineraryService.getTravelPlaces().subscribe({
      next: (data) => {
        this.TravelPlaces = data;
        this.FilteredTravelPlaces = this.TravelPlaces.filter(d =>
          (!this.filterProvince || d.address === this.filterProvince) &&
          (!this.filterDestType || d.position === this.filterDestType) &&
          (!this.filterKeyword || d.name.toLowerCase().includes(this.filterKeyword.toLowerCase()))
        );
      },
      error: (error) => {
        console.error('Error loading travel places:', error);
        this.hasApiError = true;
        // Sử dụng mock data khi API không khả dụng
        this.TravelPlaces = this.MOCK_DESTINATIONS.map(d => ({
          id: d.id,
          name: d.name,
          description: `Mô tả về ${d.name}`,
          address: d.province,
          position: d.type,
          type: d.type
        }));
        this.FilteredTravelPlaces = this.TravelPlaces.filter(d =>
          (!this.filterProvince || d.address === this.filterProvince) &&
          (!this.filterDestType || d.position === this.filterDestType) &&
          (!this.filterKeyword || d.name.toLowerCase().includes(this.filterKeyword.toLowerCase()))
        );
      }
    });
  }

  loadServices() {
    this.createItineraryService.getServices().subscribe({
      next: (data) => {
        this.Services = data;
        this.FilteredServices = this.Services.filter(s =>
          (!this.serviceProvince || s.address === this.serviceProvince) &&
          (!this.serviceType || s.position === this.serviceType) &&
          s.status === 1
        );
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.hasApiError = true;
        // Sử dụng mock data khi API không khả dụng
        this.Services = this.MOCK_SERVICES.map(s => ({
          id: s.id,
          name: s.name,
          description: `Mô tả về ${s.name}`,
          address: s.province,
          position: s.type,
          image: '',
          status: s.distanceKm
        }));
        this.FilteredServices = this.Services.filter(s =>
          (!this.serviceProvince || s.address === this.serviceProvince) &&
          (!this.serviceType || s.position === this.serviceType) &&
          s.status === 1
        );
      }
    });
  }
  retryApiCalls() {
    this.hasApiError = false;
    this.loadTravelPlaces();
    this.loadServices();
  }

  ngOnInit() {
    this.loadTravelPlaces();
    this.loadServices();
  }
}
