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
          <div class="label">Open AI KEY (openai_api_key)</div>
          <input style="width: 50px;" formControlName="openAiKey" placeholder="sk-..." />
        </label>

        <label class="field" style="padding-top: 10px">
          <div class="label">Private info (private_info)</div>
          <textarea formControlName="privateInfo" rows="30" placeholder="This won't be saved"></textarea>
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
      openAiKey: [''],
      privateInfo: ''
    });
  }

  ngOnInit(): void {
    const openAiKey = localStorage.getItem('openai_api_key');
    const privateInfo = localStorage.getItem('private_info');
    if (openAiKey) {
      this.form.patchValue({ openAiKey });
    }
    if (privateInfo) {
      this.form.patchValue({ privateInfo });
    }
  }

  save(): void {
    const key = this.form.get('openAiKey')?.value || '';
    const privateInfo = this.form.get('privateInfo')?.value || '';
    try {
      localStorage.setItem('openai_api_key', key);
      localStorage.setItem('private_info', privateInfo);
      this.saved = true;
      setTimeout(() => (this.saved = false), 2500);
    } catch (e) {
      console.error('Failed to save OpenAI key to localStorage', e);
    }
  }
}
