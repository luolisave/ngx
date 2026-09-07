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
  zone = signal('America/Toronto');
  zoneLabel = signal('TO');
  toggleZone() { this.zone.set(this.zone() === 'America/Toronto' ? 'UTC' : 'America/Toronto'); this.zoneLabel.set(this.zone() === 'America/Toronto' ? 'TO' : 'UTC'); }
  formattedTime() { const s = new Date(BUILD_TIME + 'Z').toLocaleString('en-US', { timeZone: this.zone(), year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }); const [d,t] = s.split(', '); return `${d.replace(/\//g,'-')} ${t}`; }
}
