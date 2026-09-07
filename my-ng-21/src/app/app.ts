import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BUILD_TIME } from './build-info';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('my-ng-21');
  protected readonly buildTime = signal(BUILD_TIME);
  zone = signal('America/New_York');
  zoneLabel = signal('NY');
  toggleZone() { this.zone.set(this.zone() === 'America/New_York' ? 'UTC' : 'America/New_York'); this.zoneLabel.set(this.zone() === 'America/New_York' ? 'NY' : 'UTC'); }
  formattedTime() { const s = new Date(BUILD_TIME + 'Z').toLocaleString('en-US', { timeZone: this.zone(), year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }); const [d,t] = s.split(', '); return `${d.replace(/\//g,'-')} ${t}`; }
}
