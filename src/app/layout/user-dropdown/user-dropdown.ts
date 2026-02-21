import { Component, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-dropdown',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.scss',
})
export class UserDropdown {
isOpen = signal(false);

  constructor(private eRef: ElementRef) {}

  toggle() {
    this.isOpen.update(v => !v);
  }

  // Cierra el menú si se hace clic fuera del componente
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  logout() {
    console.log('Cerrando sesión...');
    // Aquí iría tu lógica de AuthService.logout()
  }
}
