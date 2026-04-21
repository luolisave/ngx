import { Component, ChangeDetectorRef } from '@angular/core';
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
        <input [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Type a message..." />
        <button (click)="sendMessage()">Send</button>
      </div>
    </section>
  `,
  styles: [
    `:host{display:block;max-width:720px;margin:0 auto}`,
    `.chat{display:flex;flex-direction:column;gap:0.5rem;margin:1rem 0;padding:0.5rem}`,
    `.message{display:flex}`,
    `.message.user{justify-content:flex-end}`,
    `.message.bot{justify-content:flex-start}`,
    `.bubble{max-width:80%;padding:0.5rem 0.75rem;border-radius:12px;background:#f1f1f1}`,
    `.message.user .bubble{background:#0366d6;color:white}`,
    `.input-row{display:flex;gap:0.5rem;margin-top:0.75rem}`,
    `input{flex:1;padding:0.5rem;border:1px solid #ddd;border-radius:6px}`,
    `button{padding:0.5rem 0.75rem;border:none;background:#0366d6;color:#fff;border-radius:6px}`,
    `.empty{color:#666}`
  ]
})
export class BotPage {
  constructor(private cdr: ChangeDetectorRef) {}
  messages: Array<{ from: 'user' | 'bot'; text: string }> = [];
  newMessage = '';

  sendMessage() {
    const text = (this.newMessage || '').trim();
    if (!text) return;
    this.messages.push({ from: 'user', text });
    this.newMessage = '';
    this.botReply(text);
  }

  botReply(userText: string) {
    const reply = this.generateReply(userText);
    setTimeout(() => {
      this.messages.push({ from: 'bot', text: reply });
      this.cdr.detectChanges();
    }, 1000);

  }

  generateReply(userText: string) {
    const t = userText.toLowerCase();
    if (t.includes('hello') || t.includes('hi')) return 'Hello! How can I help you today?';
    if (t.includes('help')) return 'Sure — tell me what you need help with.';
    if (t.includes('time')) return `The time is ${new Date().toLocaleTimeString()}.`;
    return `You said: "${userText}"`;
  }
}
