import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente reutilizable para mostrar avatares de usuarios
 * 
 * Este componente genera avatares circulares con las iniciales del nombre del usuario.
 * Utiliza un algoritmo de colores para asignar colores consistentes basados en el nombre,
 * asegurando que el mismo usuario siempre tenga el mismo color.
 * 
 * Características principales:
 * - Generación automática de iniciales (máximo 2 caracteres)
 * - Sistema de colores basado en hash del nombre para consistencia
 * - Soporte para múltiples tamaños (sm, md, lg)
 * - Diseño responsive con efectos hover
 * 
 * Usado en: UserCardComponent para mostrar avatares en la lista de usuarios
 */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
  /**
   * Input requerido que contiene el nombre completo del usuario
   * Se usa para generar las iniciales y el color del avatar
   */
  name = input.required<string>();
  
  /**
   * Input opcional que define el tamaño del avatar
   * Por defecto es 'md' (mediano)
   * Opciones: 'sm' (pequeño), 'md' (mediano), 'lg' (grande)
   */
  size = input<'sm' | 'md' | 'lg'>('md');

  /**
   * Signal computado que genera las iniciales del nombre
   * Proceso:
   * 1. Divide el nombre en palabras
   * 2. Toma la primera letra de cada palabra
   * 3. Convierte a mayúscula
   * 4. Limita a máximo 2 caracteres
   * 
   * Ejemplos:
   * - "Juan Pérez" → "JP"
   * - "María" → "M"
   * - "Carlos Rodriguez Lopez" → "CR"
   */
  initials = computed(() => {
    const name = this.name();
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  });

  /**
   * Signal computado que genera las clases CSS para el avatar
   * Combina:
   * - Clase base para estilos comunes
   * - Color de fondo basado en el nombre (consistente)
   * - Clases de tamaño específicas
   * 
   * Sistema de colores:
   * Usa un hash del nombre para seleccionar un color de una paleta predefinida
   * Esto asegura que el mismo usuario siempre tenga el mismo color
   */
  avatarClass = computed(() => {
    const size = this.size();
    const baseClass = 'user-avatar';
    
    // Paleta de colores para los avatares
    // Se elige un color basado en la suma de los códigos ASCII del nombre
    const colors = [
      'bg-blue-500',    // Azul principal
      'bg-green-500',   // Verde
      'bg-purple-500',  // Púrpura
      'bg-pink-500',    // Rosa
      'bg-indigo-500',  // Índigo
      'bg-red-500',     // Rojo
      'bg-yellow-500',  // Amarillo
      'bg-teal-500'     // Verde azulado
    ];
    
    // Genera un índice consistente basado en el nombre
    const colorIndex = this.name().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const colorClass = colors[colorIndex];
    
    // Define las clases CSS para cada tamaño
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',    // Pequeño: 32px, texto extra pequeño
      md: 'w-12 h-12 text-sm',   // Mediano: 48px, texto pequeño
      lg: 'w-16 h-16 text-lg'    // Grande: 64px, texto grande
    };
    
    return `${baseClass} ${colorClass} ${sizeClasses[size]}`;
  });
}
