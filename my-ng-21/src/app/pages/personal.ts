import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section>
      <h1>Personal</h1>
      <p>Store your OpenAI API key here for local use.</p>

      <form [formGroup]="form" (ngSubmit)="save()" class="form">
        <label class="field">
          <div class="label">Open AI KEY</div>
          <input style="width: 50px;" formControlName="openAiKey" placeholder="sk-..." />
        </label>

        <div class="actions">
          <button type="submit">Save</button>
        </div>
      </form>

      <p *ngIf="saved" class="saved">Key saved to localStorage.</p>
    </section>
  `,
  styles: [
    `section { max-width: 720px; margin: 0 auto; }`,
    `h1 { font-size: 2rem; margin-bottom: 0.5rem }`,
    `.form { margin-top: 1rem }`,
    `.field { display: flex; flex-direction: column; gap: 0.25rem }`,
    `input { padding: 0.5rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px }`,
    `.actions { margin-top: 0.75rem }`,
    `button { padding: 0.5rem 0.75rem; font-size: 1rem }`,
    `.saved { color: #0a0; margin-top: 0.75rem }`
  ]
})
export class PersonalPage implements OnInit {
  form: FormGroup;
  saved = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      openAiKey: ['']
    });
  }

  ngOnInit(): void {
    const existing = localStorage.getItem('openai_api_key');
    if (existing) {
      this.form.patchValue({ openAiKey: existing });
    }
  }

  save(): void {
    const key = this.form.get('openAiKey')?.value || '';
    try {
      localStorage.setItem('openai_api_key', key);
      this.saved = true;
      setTimeout(() => (this.saved = false), 2500);
    } catch (e) {
      console.error('Failed to save OpenAI key to localStorage', e);
    }
  }
}
