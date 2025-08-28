import { CommonModule, DatePipe, DecimalPipe, } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { Router } from 'express';
import { ItineraryService } from '../shared/itinerary.service';

type ItemKind = 'destination' | 'service';

interface AttachedService {
  id: string;
  name: string;
  start: string | Date;
  end: string | Date;
  estimatedCost: number;
}

interface ViewItem {
  id: string;
  name: string;
  kind: ItemKind;
  province: string;
  start: string | Date;
  end: string | Date;
  cost: number;
  durationText: string;
  notes?: string[];
  attachedServices?: AttachedService[];
}

interface Group {
  id: string;
  title: string;       // ví dụ: "HÀ GIANG", "ĐỒNG VĂN"
  area: string;        // cột trái (như ảnh)
  subArea?: string;    // dòng dưới nếu có
  timeLabel: string;   // 7AM / 11:30AM ...
  color: string;       // dot màu
  estimatedCost: number;
  items: ViewItem[];
}

@Component({
  selector: 'app-itinerary-view',
  imports: [DatePipe, DecimalPipe, CommonModule],
  templateUrl: './itinerary-view.html',
  styleUrl: './itinerary-view.css'
})
export class ItineraryView implements OnInit {
  dateRange = '22–24/08/2025';
  totalCost = 0;

  groups: any[] = [];
  opened: Record<string, boolean> = {};
  itemOpened: Record<string, boolean> = {};

  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private itinerarySrv: ItineraryService
  ) { }

  ngOnInit(): void {
    // --- Demo data (mô phỏng ảnh) ---
    // this.groups = [
    //   {
    //     id: 'g1',
    //     title: 'HÀ GIANG',
    //     area: 'HÀ GIANG',
    //     subArea: 'QUẢN BẠ',
    //     timeLabel: '7:00 AM',
    //     color: 'linear-gradient(90deg,#f59e0b,#fcd34d)',
    //     estimatedCost: 0,
    //     items: [
    //       {
    //         id: '1', name: 'Cột mốc số 0 - TP Hà Giang', kind: 'destination', province: 'Hà Giang',
    //         start: '2025-08-22T07:00:00', end: '2025-08-22T07:30:00', cost: 0, durationText: '30m',
    //         notes: ['Check-in nhanh']
    //       },
    //       {
    //         id: '2', name: 'Dốc Bắc Sum', kind: 'destination', province: 'Quản Bạ',
    //         start: '2025-08-22T08:00:00', end: '2025-08-22T08:45:00', cost: 0, durationText: '45m'
    //       },
    //       {
    //         id: '3', name: 'Chợ Quyết Tiến', kind: 'service', province: 'Quản Bạ',
    //         start: '2025-08-22T09:00:00', end: '2025-08-22T10:00:00', cost: 80000, durationText: '1h',
    //         notes: ['Ăn sáng nhẹ']
    //       },
    //       {
    //         id: '4', name: 'Núi đôi Quản Bạ', kind: 'destination', province: 'Quản Bạ',
    //         start: '2025-08-22T10:15:00', end: '2025-08-22T11:00:00', cost: 0, durationText: '45m'
    //       },
    //     ]
    //   },
    //   {
    //     id: 'g2',
    //     title: 'ĐỒNG VĂN',
    //     area: 'YÊN MINH',
    //     subArea: 'ĐỒNG VĂN',
    //     timeLabel: '11:30 AM',
    //     color: 'linear-gradient(90deg,#22d3ee,#60a5fa)',
    //     estimatedCost: 120000,
    //     items: [
    //       {
    //         id: '5', name: 'Rừng thông Yên Minh', kind: 'destination', province: 'Yên Minh',
    //         start: '2025-08-22T11:30:00', end: '2025-08-22T12:30:00', cost: 0, durationText: '1h'
    //       },
    //       {
    //         id: '6', name: 'Sủng Là • Phim trường “Chuyện của Pao”', kind: 'destination', province: 'Đồng Văn',
    //         start: '2025-08-22T13:30:00', end: '2025-08-22T14:30:00', cost: 0, durationText: '1h',
    //         attachedServices: [
    //           { id: 'a1', name: 'Vé tham quan', start: '2025-08-22T13:30:00', end: '2025-08-22T14:30:00', estimatedCost: 30000 }
    //         ]
    //       },
    //       {
    //         id: '7', name: 'Dinh thự Họ Vương', kind: 'destination', province: 'Đồng Văn',
    //         start: '2025-08-22T15:00:00', end: '2025-08-22T16:00:00', cost: 50000, durationText: '1h'
    //       },
    //     ]
    //   },
    //   {
    //     id: 'g3',
    //     title: 'MÈO VẠC',
    //     area: 'MÈO VẠC',
    //     timeLabel: '5:30 PM',
    //     color: 'linear-gradient(90deg,#fb7185,#f43f5e)',
    //     estimatedCost: 150000,
    //     items: [
    //       {
    //         id: '8', name: 'Đèo Mã Pí Lèng – Sông Nho Quế', kind: 'destination', province: 'Mèo Vạc',
    //         start: '2025-08-22T17:30:00', end: '2025-08-22T18:30:00', cost: 150000, durationText: '1h',
    //         notes: ['Đi thuyền (nếu kịp)']
    //       }
    //     ]
    //   }
    // ];

    // tính tổng chi phí
    // this.totalCost = this.groups
    //   .flatMap(g => g.items)
    //   .reduce((s, it) => s + (it.cost || 0) + (it.attachedServices?.reduce((a, b) => a + (b.estimatedCost || 0), 0) || 0), 0);

    // mở nhóm đầu tiên
    // this.groups.forEach((g, i) => this.opened[g.id] = i === 0);

    const id = this.ar.snapshot.paramMap.get('id')!;
    const it = this.itinerarySrv.getById(id);

    if (!it) { this.router.navigateByUrl('/'); return; }

    // bạn có thể set meta cho header
    this.dateRange = it.duration;

    // TODO: map từ itinerary thực sang groups dùng cho timeline
    // Tạm dùng dữ liệu mẫu (giống bạn đã có). Khi có API thực, map vào đây.
    this.groups = this.buildDemoGroupsFor(id);

    this.totalCost = this.groups
      .flatMap(g => g.items)
      .reduce((s: number, item: any) =>
        s + (item.cost || 0) + (item.attachedServices?.reduce((a: number, b: any) => a + (b.estimatedCost || 0), 0) || 0), 0);

    // mở nhóm đầu tiên
    this.groups.forEach((g, i) => this.opened[g.id] = i === 0);
  }

  private buildDemoGroupsFor(id: string) {
    if (id === '1') {
      return [
        {
          id: 'g1', title: 'SAPA NGÀY 1', area: 'SAPa', subArea: 'Trung tâm',
          timeLabel: '7:00 AM', color: 'linear-gradient(90deg,#f59e0b,#fcd34d)', estimatedCost: 200000,
          items: [
            {
              id: '1', name: 'Nhà thờ Đá', kind: 'destination', province: 'Lào Cai',
              start: '2025-08-22T07:00:00', end: '2025-08-22T08:00:00', cost: 0, durationText: '1h'
            },
            {
              id: '2', name: 'Bản Cát Cát', kind: 'destination', province: 'Lào Cai',
              start: '2025-08-22T08:30:00', end: '2025-08-22T10:00:00', cost: 70000, durationText: '1h30'
            },
          ]
        },
        {
          id: 'g2', title: 'SAPA NGÀY 2', area: 'SAPa',
          timeLabel: '9:00 AM', color: 'linear-gradient(90deg,#22d3ee,#60a5fa)', estimatedCost: 300000,
          items: [
            {
              id: '3', name: 'Fansipan (cáp treo)', kind: 'service', province: 'Lào Cai',
              start: '2025-08-23T09:00:00', end: '2025-08-23T12:00:00', cost: 300000, durationText: '3h'
            },
          ]
        }
      ];
    }
    // id === '2'
    return [
      {
        id: 'g1', title: 'HỘI AN NGÀY 1', area: 'HỘI AN',
        timeLabel: '4:30 PM', color: 'linear-gradient(90deg,#fb7185,#f43f5e)', estimatedCost: 150000,
        items: [
          {
            id: '1', name: 'Dạo phố đèn lồng', kind: 'destination', province: 'Quảng Nam',
            start: '2025-08-22T16:30:00', end: '2025-08-22T18:30:00', cost: 0, durationText: '2h'
          },
          {
            id: '2', name: 'Thuyền trên sông Hoài', kind: 'service', province: 'Quảng Nam',
            start: '2025-08-22T19:00:00', end: '2025-08-22T19:45:00', cost: 150000, durationText: '45m'
          },
        ]
      }
    ];
  }

  toggleGroup(id: string) { this.opened[id] = !this.opened[id]; }
  toggleItem(id: string) { this.itemOpened[id] = !this.itemOpened[id]; }

  expandAll() {
    this.groups.forEach(g => this.opened[g.id] = true);
  }
  collapseAll() {
    this.groups.forEach(g => this.opened[g.id] = false);
    this.itemOpened = {};
  }
}
