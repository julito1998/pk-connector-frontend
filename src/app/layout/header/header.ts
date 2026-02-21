import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  // Esto obliga al componente a comportarse como un bloque de ancho completo
  host: {
    'class': 'block w-full'
  }
})
export class Header {
  ambiente = 'TESTING / QA';
}