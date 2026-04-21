import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section>
      <h1>Personal</h1>
      <p>This is the personal page. Add your bio, links, and contact info here.</p>
      <ul>
        <li>Bio: Your short bio goes here.</li>
        <li>Work: Current role or projects.</li>
        <li>Contact: email@example.com</li>
      </ul>
    </section>
  `,
  styles: [
    `section { max-width: 720px; margin: 0 auto; }`,
    `h1 { font-size: 2rem; margin-bottom: 0.5rem }`,
    `p, li { color: #444; line-height: 1.6 }`
  ]
})
export class PersonalPage {}
