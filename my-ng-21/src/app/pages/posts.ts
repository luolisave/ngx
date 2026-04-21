import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Post { title: string; date: string; excerpt?: string }

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h1>Posts</h1>
      <p>Recent posts:</p>
      <ul>
        <li *ngFor="let p of posts">
          <strong>{{ p.title }}</strong>
          <div style="color:#666;font-size:0.9rem">{{ p.date }}</div>
          <p *ngIf="p.excerpt" style="margin-top:0.25rem">{{ p.excerpt }}</p>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `section { max-width: 720px; margin: 0 auto; }`,
    `h1 { font-size: 1.75rem; margin-bottom: 0.5rem }`,
    `ul { padding-left:1rem }`,
    `li { margin-bottom:1rem }`
  ]
})
export class PostsPage {
  posts: Post[] = [
    { title: 'First Post', date: '2026-04-21', excerpt: 'An intro to this site.' },
    { title: 'Thoughts on Angular', date: '2026-03-10', excerpt: 'Notes about building with Angular.' },
    { title: 'A tiny project', date: '2025-12-05', excerpt: 'Small experiments and demos.' }
  ];
}
