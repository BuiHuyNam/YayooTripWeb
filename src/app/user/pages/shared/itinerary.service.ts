import { Injectable } from '@angular/core';
export interface ItineraryCard {
  id: string; title: string; description: string; image: string;
  duration: string; budget: string; likes: number; comments?: number;
  views: number; isPublic: boolean; createdAt: string;
}
@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private mockItineraries: ItineraryCard[] = [
    {
      id: '1',
      title: 'Khám phá Sapa 3 ngày 2 đêm',
      description: 'Lịch trình chi tiết khám phá Sapa với ruộng bậc thang, thác Bạc và chợ tình Sapa',
      image: '/sapa-terraced-rice-fields-mountains-vietnam.png',
      duration: '3 ngày 2 đêm',
      budget: '2.500.000 VNĐ',
      likes: 89, comments: 156, views: 1240,
      isPublic: true, createdAt: '1 tuần trước',
    },
    {
      id: '2',
      title: 'Hội An cổ kính 2 ngày 1 đêm',
      description: 'Trải nghiệm phố cổ Hội An với đèn lồng, ẩm thực và văn hóa truyền thống',
      image: '/hoi-an-ancient-town-lanterns-vietnam.png',
      duration: '2 ngày 1 đêm',
      budget: '1.800.000 VNĐ',
      likes: 67, comments: 123, views: 890,
      isPublic: true, createdAt: '2 tuần trước',
    },
  ];

  getAll() { return this.mockItineraries; }
  getById(id: string) { return this.mockItineraries.find(x => x.id === id) || null; }
}
