import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-5-nano';
const SYSTEM_PROMPT =
  `You are a helpful assistant.
   Your job is help user input information into a web form.
   This Form have several fields: first name, last name, email, from account, to account and amount.
     - first name, last name and email are user's private information, you should ask user to fill them first if you don't have them, and never ask for them again after you got them.
     - account can only be in following value: chequing :"1234" or savings: "5678", or credit: "9999"
     - fill the account and amount information if there is enough instruction in user private info or user's message, otherwise ask user for the missing information.
     - from account, to account and amount are related to the transaction user want to make, you can ask for them in any order, and you can ask for them multiple times if needed.
   You should use given tools to set the value of each field based on the user's input.
   If tool call(s) failed, ask user if they want try again.
   If you don't have enough information to fill a field, fill others first, then ask user for the missing information.
   Only fill form when user ask you to do so.
  `;
const TOOLS = [
  {
    "type": "function",
    "function": {
      "name": "setFirstName",
      "description": "Set the user's first name",
      "parameters": {
        "type": "object",
        "properties": {
          "firstName": {
            "type": "string",
            "description": "The user's first name"
          }
        },
        "required": ["firstName"],
        "additionalProperties": false
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "setLastName",
      "description": "Set the user's last name",
      "parameters": {
        "type": "object",
        "properties": {
          "lastName": {
            "type": "string",
            "description": "The user's last name"
          }
        },
        "required": ["lastName"],
        "additionalProperties": false
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "setEmail",
      "description": "Set the user's email",
      "parameters": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "description": "The user's email"
          }
        },
        "required": ["email"],
        "additionalProperties": false
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "setFromAccount",
      "description": "Set the user's from account",
      "parameters": {
        "type": "object",
        "properties": {
          "fromAccount": {
            "type": "string",
            "description": "The user's from account"
          }
        },
        "required": ["fromAccount"],
        "additionalProperties": false
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "setToAccount",
      "description": "Set the user's to account",
      "parameters": {
        "type": "object",
        "properties": {
          "toAccount": {
            "type": "string",
            "description": "The user's to account"
          }
        },
        "required": ["toAccount"],
        "additionalProperties": false
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "setAmount",
      "description": "Set the user's amount",
      "parameters": {
        "type": "object",
        "properties": {
          "amount": {
            "type": "string",
            "description": "The user's amount"
          }
        },
        "required": ["amount"],
        "additionalProperties": false
      }
    }
  }
]

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bot-page-wrap">
      <section class="business-wrap">
        <h1>Business</h1>
        <p>Here is an example form, you can enter your information here:</p>

        <div>
          <form [formGroup]="form" (ngSubmit)="submitForm()">
            <div class="api-row">
              <label for="first-name">First Name:</label>
              <input id="first-name" formControlName="firstName" placeholder="Enter your first name" />
            </div>
            <div class="api-row">
              <label for="last-name">Last Name:</label>
              <input id="last-name" formControlName="lastName" placeholder="Enter your last name" />
            </div>
            <div class="api-row">
              <label for="email">Email: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
              <input id="email" formControlName="email" placeholder="Enter your email" />
            </div>
            <hr />
            <div class="api-row">
              <label for="from-account">From Account:</label>
              <select id="from-account" formControlName="fromAccount">
                <option value="1234">chequing account</option>
                <option value="5678">saving account</option>
                <option value="9999">credit account</option>
              </select>
            </div>
            <div class="api-row">
              <label for="to-account">To Account:</label>
              <select id="to-account" formControlName="toAccount">
                <option value="1234">chequing account</option>
                <option value="5678">saving account</option>
                <option value="9999">credit card</option>
              </select>
            </div>
            <div class="api-row">
              <label for="amount">Amount:</label>
              <input id="amount" formControlName="amount" placeholder="Enter your amount" />
            </div>
            <div><button type="submit">Submit</button></div>
          </form>
        </div>
      </section>
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
    </div>
  `,
  styles: [
    `.api-row{display:flex;gap:0.5rem;margin-bottom:0.5rem}`,
    `:host{display:block;margin:0 auto;padding:1rem}`,
    `.bot-page-wrap{display:grid;grid-template-columns:2fr 1fr;gap:1rem;align-items:start}`,
    `.business-wrap{padding:1rem;border:1px solid #eee;border-radius:8px;background:#fafafa}`,
    `.chat-wrap{padding:1rem;border:1px solid #eee;border-radius:8px;background:#fff}`,
    `.chat{display:flex;flex-direction:column;gap:0.5rem;margin:0.5rem 0;padding:0.5rem;overflow:auto;max-height:60vh}`,
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
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {}
  messages: Array<{ from: 'user' | 'bot'; text: string }> = [];
  newMessage = '';
  apiKey = '';
  loading = false;
  userPrivateInfo = '';
  history: Array<{ role: string; content: string; tool_call_id?: string, tool_calls?: any[] }> = [];

  form!: FormGroup;

  submitForm() {
    if (!this.form) return;
    const { firstName, lastName, email } = this.form.value;
    alert(`Submitted: ${firstName} ${lastName} (${email})`);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    try { this.apiKey = this.apiKey || (localStorage.getItem('openai_api_key') || ''); } catch(e) {}
    // initialize reactive form
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      fromAccount: [''],
      toAccount: [''],
      amount: ['']
    });

    this.userPrivateInfo = localStorage.getItem('private_info') || '';
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
      let reply = '';
      while (reply.startsWith('tool executed') || !reply) {
        if (reply.startsWith('tool executed')) {
          reply = await this.openAIChat('');
        } else if (!reply) {
          reply = await this.openAIChat(userText);
        }

      }
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

    const url = OPENAI_API_URL;

    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT + " \n\n User Private Info: " + this.userPrivateInfo + "\n\n" },
        ...this.history,
      ],
      tools: TOOLS
    };
    if (userText) {
      body.messages.push({ role: 'user', content: userText });
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    this.history.push({ role: 'user', content: userText });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`${resp.status} ${resp.statusText} - ${txt}`);
    }

    const data = await resp.json();
    // Log full response to help debug empty content / truncation
    try { console.log('openAI response', JSON.stringify(data, null, 2)); } catch (e) {}

    const ch = Array.isArray(data?.choices) && data.choices.length ? data.choices[0] : null;
    const maybeContent = ch?.message?.content ?? ch?.text ?? (ch?.delta && ch.delta.content) ?? '';
    const maybeToolCalls = ch?.message?.tool_calls ?? ch?.tool_calls ?? [];

    // tool calls
    console.log('maybetoolCalls', maybeToolCalls);
    if (maybeToolCalls.length) {
      this.history.push({ role: "assistant", content: "", tool_calls: maybeToolCalls });
      for (const call of maybeToolCalls) {
        if (call.function.name === 'setFirstName') {
          const firstName = JSON.parse(call.function.arguments).firstName || '';
          this.form.patchValue({ firstName });
          this.history.push({ role: "tool", tool_call_id: call.id, content: "success" });
          console.log('tool executed: First name set to:', firstName);
        } else if (call.function.name === 'setLastName') {
          const lastName = JSON.parse(call.function.arguments).lastName || '';
          this.form.patchValue({ lastName });
          this.history.push({ role: "tool", tool_call_id: call.id, content: "success" });
          console.log('tool executed: Last name set to:', lastName);
        } else if (call.function.name === 'setEmail') {
          const email = JSON.parse(call.function.arguments).email || '';
          this.form.patchValue({ email });
          this.history.push({ role: "tool", tool_call_id: call.id, content: "success" });
          console.log('tool executed: Email set to:', email);
        } else if (call.function.name === 'setFromAccount') {
          const fromAccount = JSON.parse(call.function.arguments).fromAccount || '';
          this.form.patchValue({ fromAccount });
          this.history.push({ role: "tool", tool_call_id: call.id, content: "success" });
          console.log('tool executed: From account set to:', fromAccount);
        } else if (call.function.name === 'setToAccount') {
          const toAccount = JSON.parse(call.function.arguments).toAccount || '';
          this.form.patchValue({ toAccount });
          this.history.push({ role: "tool", tool_call_id: call.id, content: "success" });
          console.log('tool executed: To account set to:', toAccount);
        } else if (call.function.name === 'setAmount') {
          const amount = JSON.parse(call.function.arguments).amount || '';
          this.form.patchValue({ amount });
          this.history.push({ role: "tool", tool_call_id: call.id, content: "success" });
          console.log('tool executed: Amount set to:', amount);
        }
      }
      return 'tool executed: Form updated based on your input!';
    } else if (!maybeContent) {
      // If the model was truncated, provide a helpful message instead of failing silently
      if (ch?.finish_reason === 'length') {
        const partial = (ch?.message?.content || ch?.text || '').trim();
        return (partial || 'Response truncated by token limit') + ' (truncated)';
      }
      throw new Error('No response from model');
    } else if (maybeContent) {
      this.history.push({ role: 'assistant', content: maybeContent });
    }

    return String(maybeContent).trim();
  }

  generateReply(userText: string) {
    const t = userText.toLowerCase();
    return `No OpenAI key found. \nYou said: "${userText}"`;
  }
}
