import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { User } from '../users.component';

/**
 * Componente que representa la card individual de un usuario en la lista
 * 
 * Este componente es responsable de mostrar la información de un usuario específico
 * en formato de card visual con todas las acciones disponibles (editar, eliminar).
 * Es un componente presentacional que recibe los datos del usuario a través de inputs
 * y emite eventos al componente padre cuando se realizan acciones.
 * 
 * Estructura visual:
 * - Avatar con iniciales del usuario
 * - Información básica (nombre, email)
 * - Empresa asignada
 * - Rol con badge coloreado
 * - Botones de acción (editar, eliminar)
 * 
 * Comunicación con el padre:
 * - Recibe user como input obligatorio
 * - Emite eventos edit y delete cuando se presionan los botones
 */
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, UserAvatarComponent],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  /**
   * Input requerido que contiene los datos completos del usuario a mostrar
   * Este input es obligatorio y debe contener toda la información del usuario
   */
  user = input.required<User>();
  
  /**
   * Output que se emite cuando se presiona el botón de editar
   * Envía el objeto User completo para que el componente padre maneje la edición
   */
  edit = output<User>();
  
  /**
   * Output que se emite cuando se presiona el botón de eliminar
   * Envía el objeto User completo para que el componente padre maneje la eliminación
   */
  delete = output<User>();

  /**
   * Método que genera las clases CSS para los badges de roles
   * Asigna colores específicos según el rol del usuario para facilitar
   * la identificación visual rápida de los permisos
   * 
   * Sistema de colores:
   * - SUPER ADMIN: Púrpura (máximo privilegio)
   * - CLIENT ADMIN: Azul (privilegios altos)
   * - USER: Verde (privilegios estándar)
   * - VIEWER: Gris (privilegios de solo lectura)
   * 
   * @returns string con las clases CSS para el badge del rol
   */
  roleBadgeClass() {
    const role = this.user().role;
    const baseClass = 'inline-flex px-3 py-1 text-xs font-semibold rounded-full';
    
    switch (role) {
      case 'SUPER ADMIN':
        return `${baseClass} bg-purple-100 text-purple-800`;
      case 'CLIENT ADMIN':
        return `${baseClass} bg-blue-100 text-blue-800`;
      case 'USER':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'VIEWER':
        return `${baseClass} bg-gray-100 text-gray-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }
}
