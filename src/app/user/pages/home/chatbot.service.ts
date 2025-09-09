import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: string;
};

@Injectable({ providedIn: 'root' })
export class ChatbotService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.apiChatbot;

    // Adjust endpoint path according to backend
    private readonly chatEndpoint = `${this.baseUrl}/v1/ask`;

    sendMessage(prompt: string) {
        const params = new HttpParams()
            .set('prompt', prompt)
            .set('time_style', 'now_z');
        // .set('ngrok-skip-browser-warning', 'true');
        return this.http
            .post<{ reply: string }>(this.chatEndpoint, null, { params });
        // .pipe(map(text => ({ reply: string })));
    }
}


