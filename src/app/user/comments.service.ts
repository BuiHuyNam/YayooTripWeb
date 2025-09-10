import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../environments/environment';

export interface CommentItem {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private API_BASE = environment.apiGatWay; // ví dụ http://localhost:5004
  private URL = `${this.API_BASE}/api/comment`; // <-- điều chỉnh nếu BE khác

  constructor(private http: HttpClient) {}

  private token() {
    try { return localStorage.getItem('login') || ''; } catch { return ''; }
  }
  private headers() {
    const t = this.token();
    return new HttpHeaders({ Accept: 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) });
  }

  getComments(postId: string): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(`${this.URL}/GetCommentByPostId/${postId}`, { headers: this.headers() })
      .pipe(catchError(_ => of([])));
  }

  addComment(postId: string, content: string): Observable<CommentItem> {
    const body = { postId, content };
    return this.http.post<CommentItem>(this.URL, body, { headers: this.headers() });
  }
}
