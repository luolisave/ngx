import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="chat-wrap">
      <h1>Bot</h1>
      <div class="chat" *ngIf="messages.length; else empty">
        <div *ngFor="let m of messages" class="message" [class.user]="m.from==='user'" [class.bot]="m.from==='bot'">
          <div class="bubble">{{ m.text }}</div>
        </div>
      </div>
      <ng-template #empty>
        <p class="empty">Say hi — I'll reply!</p>
      </ng-template>

      <div class="input-row">
        <input [disabled]="loading" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Type a message..." />
        <button [disabled]="loading" (click)="sendMessage()">Send</button>
      </div>
    </section>
  `,
  styles: [
    `.api-row{display:flex;gap:0.5rem;margin-bottom:0.5rem}`,
    `:host{display:block;max-width:720px;margin:0 auto}`,
    `.chat{display:flex;flex-direction:column;gap:0.5rem;margin:1rem 0;padding:0.5rem}`,
    `.message{display:flex}`,
    `.message.user{justify-content:flex-end}`,
    `.message.bot{justify-content:flex-start}`,
    `.bubble{max-width:80%;padding:0.5rem 0.75rem;border-radius:12px;background:#f1f1f1}`,
    `.message.user .bubble{background:#0366d6;color:white}`,
    `.input-row{display:flex;gap:0.5rem;margin-top:0.75rem}`,
    `input{flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:6px}`,
    `input:disabled{opacity:0.6;cursor:not-allowed;background:#f7f7f7}`,
    `button{padding:0.5rem 0.75rem;border:none;background:#0366d6;color:#fff;border-radius:6px}`,
    `button:disabled{opacity:0.6;cursor:not-allowed;background:#999;color:#eee}`,
    `.empty{color:#666}`
  ]
})
export class BotPage implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  messages: Array<{ from: 'user' | 'bot'; text: string }> = [];
  newMessage = '';
  apiKey = '';
  loading = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    try { this.apiKey = this.apiKey || (localStorage.getItem('openai_api_key') || ''); } catch(e) {}
  }

  sendMessage() {
    const text = (this.newMessage || '').trim();
    if (!text) return;
    if (this.loading) return;
    this.messages.push({ from: 'user', text });
    this.newMessage = '';
    this.loading = true;
    this.botReply(text);
  }

  async botReply(userText: string) {
    // show a typing placeholder
    this.messages.push({ from: 'bot', text: '...' });
    this.cdr.detectChanges();

    // ensure loading state in case botReply is called directly
    this.loading = true;

    try {
      const reply = await this.openAIChat(userText);
      // replace the last bot message (the typing placeholder)
      for (let i = this.messages.length - 1; i >= 0; i--) {
        if (this.messages[i].from === 'bot' && this.messages[i].text === '...') {
          this.messages[i].text = reply;
          break;
        }
      }
    } catch (err: any) {
      const msg = err && err.message ? err.message : 'Error contacting OpenAI';
      for (let i = this.messages.length - 1; i >= 0; i--) {
        if (this.messages[i].from === 'bot' && this.messages[i].text === '...') {
          this.messages[i].text = `Error: ${msg}`;
          break;
        }
      }
    }

    // Clear loading and update UI
    this.loading = false;
    this.cdr.detectChanges();
  }

  async openAIChat(userText: string) {
    // load key from localStorage if available
    try { this.apiKey = this.apiKey || (localStorage.getItem('openai_api_key') || ''); } catch(e) {}

    if (!this.apiKey) {
      // local fallback reply if there's no API key
      return this.generateReply(userText) + ' (local fallback — set API key to use GPT)';
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const body = {
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userText }
      ]
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`${resp.status} ${resp.statusText} - ${txt}`);
    }

    const data = await resp.json();
    // Log full response to help debug empty content / truncation
    try { console.log('openAI response', JSON.stringify(data, null, 2)); } catch (e) {}

    const ch = Array.isArray(data?.choices) && data.choices.length ? data.choices[0] : null;
    const maybeContent = ch?.message?.content ?? ch?.text ?? (ch?.delta && ch.delta.content) ?? '';

    if (!maybeContent) {
      // If the model was truncated, provide a helpful message instead of failing silently
      if (ch?.finish_reason === 'length') {
        const partial = (ch?.message?.content || ch?.text || '').trim();
        return (partial || 'Response truncated by token limit') + ' (truncated)';
      }
      throw new Error('No response from model');
    }

    return String(maybeContent).trim();
  }

  generateReply(userText: string) {
    const t = userText.toLowerCase();
    if (t.includes('hello') || t.includes('hi')) return 'Hello! How can I help you today?';
    if (t.includes('help')) return 'Sure — tell me what you need help with.';
    if (t.includes('time')) return `The time is ${new Date().toLocaleTimeString()}.`;
    return `You said: "${userText}"`;
  }
}
