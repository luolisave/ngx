import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section>
      <h1>Hi — I'm Your Name</h1>
      <p>Welcome to my personal website. I'm a developer who loves building web apps and exploring new technologies.</p>
      <p>Use the navigation above to learn more or read posts.</p>
    </section>
  `,
  styles: [
    `section { max-width: 720px; margin: 0 auto; }`,
    `h1 { font-size: 2rem; margin-bottom: 0.5rem }`,
    `p { color: #444; line-height: 1.6 }`
  ]
})
export class HomePage {}
