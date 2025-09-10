import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../environments/environment'; // kiểm tra path này đúng với project của bạn

export interface ApiReactionSummary {
  reactionType: string;
  count: number;
}
export interface ApiPostDto {
  id: string;
  createdAt: string;
  createBy: string;
  updateAt: string;
  updateBy: string;
  title: string;
  content: string;
  postImg: string;
  userId: string;
  images?: string[];
  reactionSummary?: ApiReactionSummary[];
  totalComment: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  postImg: string;
  authorName: string;
  createdAt: Date;
  userId: string;
  likeCount: number;
  totalComment: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  postImg?: string;
}

@Injectable({ providedIn: 'root' })
export class SocialService {
  // CHỈ để base URL (không kèm /api/Post)
  private readonly API_BASE = environment.apiGatWay; // ví dụ: 'http://localhost:5004'
  private UPLOAD_URL = `${this.API_BASE}/api/Post/uploadImg`; 

/** Upload 1 file, backend trả về { url: string } */
uploadImage(file: File): Observable<{ url: string }> {
  const form = new FormData();
  form.append('file', file);

  const token = this.getTokenSafely();
  const headers = new HttpHeaders({
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  return this.http.post<{ url: string }>(this.UPLOAD_URL, form, { headers });
}



  constructor(private http: HttpClient) {}

//lấy ra các bài post
  getPosts(): Observable<Post[]> {
    const token = localStorage.getItem('login'); // token string thuần

    const headers = new HttpHeaders({
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    // Gọi đúng endpoint 1 lần
    return this.http.get<ApiPostDto[]>(`${this.API_BASE}/api/Post`, { headers }).pipe(
      map(dtos => dtos.map(dto => this.toPost(dto))),
      catchError(err => {
        console.error('getPosts error:', err);
        return of([] as Post[]);
      })
    );
  }

   /** Chỉ đọc localStorage khi chạy trên browser */
  private getTokenSafely(): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('login');
      }
    } catch {}
    return null;
  }


  //tạo bài post
 createPost(payload: CreatePostRequest): Observable<Post> {
    const token = this.getTokenSafely();
    const headers = new HttpHeaders({
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    const body: CreatePostRequest = {
      title: payload.title?.trim(),
      content: payload.content?.trim(),
      postImg: (payload.postImg?.trim() || 'assets/images/avatar.jpg')
    };

    return this.http.post<ApiPostDto>(`${this.API_BASE}/api/Post`, body, { headers }).pipe(
      map(dto => this.toPost(dto))
    );
  }

//add reaction
  addReaction(postId: string, reactionType: 'Like' | 'Love' | 'Haha' = 'Like'): Observable<void> {
  const token = this.getTokenSafely();
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  const body = {
    targetType: 'Post',
    targetId: postId,
    reactionType: reactionType
  };

  // Nếu Reaction API ở cổng khác (5011) thì dùng base riêng
  const REACTION_URL = `${this.API_BASE}/api/Reaction`;

  return this.http.post<void>(REACTION_URL, body, { headers });
}




  private toPost(dto: ApiPostDto): Post {
    return {
      id: dto.id,
      title: dto.title,
      content: dto.content,
      postImg: dto.postImg,
      authorName: dto.createBy,
      createdAt: new Date(dto.createdAt),
      userId: dto.userId,
      likeCount: dto.reactionSummary?.find(r => r.reactionType === 'Like')?.count || 0,
      totalComment: dto.totalComment
    };
  }
}
