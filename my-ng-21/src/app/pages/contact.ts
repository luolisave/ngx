import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section>
      <h1>Contact</h1>
      <p>If you'd like to get in touch, you can email me at <a href="mailto:you@example.com">you@example.com</a>.</p>

      <h2 style="margin-top:1.25rem">Quick message</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="max-width:520px;">
        <div style="margin-bottom:0.5rem">
          <label style="display:block;font-size:0.9rem;margin-bottom:0.25rem">Name</label>
          <input formControlName="name" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:4px" />
        </div>
        <div style="margin-bottom:0.5rem">
          <label style="display:block;font-size:0.9rem;margin-bottom:0.25rem">Message</label>
          <textarea formControlName="message" rows="5" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:4px"></textarea>
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
  form = this.fb.group({
    name: [''],
    message: ['']
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    // Placeholder: intentionally non-functional. Replace with real handler if desired.
    alert('Thanks — message not actually sent in this demo.');
    const { name, message } = this.form.value;
    console.log('Name:', name ?? '');
    console.log('Message:', message ?? '');
  }
}
