import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section>
      <h1>About</h1>
      <p>This is an about page. Add information about yourself, your experience, and links to social profiles or projects.</p>
    </section>
  `,
  styles: [
    `section { max-width: 720px; margin: 0 auto; }`,
    `h1 { font-size: 1.75rem; margin-bottom: 0.5rem }`,
    `p { color: #444; line-height: 1.6 }`
  ]
})
export class AboutPage {}
