import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <section>
      <h1>Contact</h1>
      <p>If you'd like to get in touch, you can email me at <a href="mailto:you@example.com">you@example.com</a>.</p>

      <h2 style="margin-top:1.25rem">Quick message</h2>
      <form (submit)="onSubmit($event)" style="max-width:520px;">
        <div style="margin-bottom:0.5rem">
          <label style="display:block;font-size:0.9rem;margin-bottom:0.25rem">Name</label>
          <input name="name" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:4px" />
        </div>
        <div style="margin-bottom:0.5rem">
          <label style="display:block;font-size:0.9rem;margin-bottom:0.25rem">Message</label>
          <textarea name="message" rows="5" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:4px"></textarea>
        </div>
        <button type="submit" style="padding:0.5rem 0.75rem;border-radius:4px;border:none;background:#0366d6;color:#fff">Send</button>
      </form>
    </section>
  `,
  styles: [
    `section { max-width: 720px; margin: 0 auto; }`,
    `h1 { font-size: 1.75rem; margin-bottom: 0.5rem }`,
    `p { color: #444; line-height: 1.6 }`
  ]
})
export class ContactPage {
  onSubmit(ev: Event) {
    ev.preventDefault();
    // Placeholder: intentionally non-functional. Replace with real handler if desired.
    alert('Thanks — message not actually sent in this demo.');
  }
}
