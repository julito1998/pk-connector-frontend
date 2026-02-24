import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Header } from './layout/header/header';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    'class': 'block w-full h-screen'
  }
})
export class App {
  protected readonly title = signal('pk-connector-frontend');
  private router = inject(Router);
  
  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );
  
  isLoginPage = computed(() => {
    const url = this.currentUrl();
    return url?.startsWith('/login') || url === '';
  });
}
