import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { UserFormComponent } from './user-form/user-form.component';

/**
 * Interfaz que define la estructura de datos de un usuario
 * Contiene toda la información necesaria para representar un usuario en el sistema
 */
export interface User {
  id: number;                    // Identificador único del usuario
  name: string;                  // Nombre completo del usuario
  email: string;                 // Email del usuario (usado para login y notificaciones)
  company: string;               // Empresa a la que pertenece el usuario
  role: 'CLIENT ADMIN' | 'SUPER ADMIN' | 'USER' | 'VIEWER';  // Rol del usuario con permisos específicos
  status: 'active' | 'inactive'; // Estado del usuario (solo usuarios activos pueden acceder)
}

/**
 * Componente principal de gestión de usuarios (ABM - Altas, Bajas, Modificaciones)
 * 
 * Este componente es el contenedor principal que maneja toda la lógica de CRUD de usuarios.
 * Utiliza signals de Angular para la gestión reactiva del estado y componentes hijos
 * para la visualización y edición de datos.
 * 
 * Funcionalidades principales:
 * - Listado de usuarios con cards visuales
 * - Creación de nuevos usuarios mediante modal
 * - Edición de usuarios existentes
 * - Eliminación con confirmación
 * - Gestión de estado de la UI (modal abierto/cerrado)
 */
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    UserCardComponent, 
    UserFormComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  /**
   * Signal privado que almacena la lista de usuarios
   * Se usa signal para que los cambios se reflejen automáticamente en la UI
   * Inicialmente contiene datos de ejemplo para demostración
   */
  private _users = signal<User[]>([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      company: 'Empresa A',
      role: 'CLIENT ADMIN',
      status: 'active'
    },
    {
      id: 2,
      name: 'María Alvarez',
      email: 'maria.alvarez@empresa.com',
      company: 'Empresa B',
      role: 'SUPER ADMIN',
      status: 'active'
    },
    {
      id: 3,
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@empresa.com',
      company: 'Empresa C',
      role: 'USER',
      status: 'active'
    },
    {
      id: 4,
      name: 'Ana Martinez',
      email: 'ana.martinez@empresa.com',
      company: 'Empresa D',
      role: 'VIEWER',
      status: 'inactive'
    }
  ]);

  /**
   * Signal computado que expone la lista de usuarios de forma readonly
   * Permite que otros componentes lean la lista pero no la modifiquen directamente
   */
  users = computed(() => this._users());
  
  /**
   * Signal que almacena el usuario que está siendo editado actualmente
   * null significa que no hay ningún usuario en modo edición
   */
  editingUser = signal<User | null>(null);
  
  /**
   * Signal que controla la visibilidad del modal de creación
   * true = modal visible, false = modal oculto
   */
  showCreateForm = signal(false);

  /**
   * Método que activa el modo edición para un usuario específico
   * @param user - Usuario que se desea editar
   */
  editUser(user: User) {
    this.editingUser.set(user);
  }

  /**
   * Método que elimina un usuario después de confirmación
   * Muestra un diálogo de confirmación antes de proceder con la eliminación
   * @param user - Usuario que se desea eliminar
   */
  deleteUser(user: User) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${user.name}?`)) {
      // Filtra la lista para eliminar el usuario especificado
      this._users.update(users => users.filter(u => u.id !== user.id));
    }
  }

  /**
   * Método que guarda los datos de un usuario (crear o actualizar)
   * Determina si es una creación o edición basándose en el estado de editingUser
   * @param userData - Datos del usuario a guardar (sin id para nuevos usuarios)
   */
  saveUser(userData: Omit<User, 'id'>) {
    if (this.editingUser()) {
      // Modo edición: actualiza el usuario existente
      this._users.update(users => 
        users.map(u => 
          u.id === this.editingUser()!.id 
            ? { ...u, ...userData }  // Fusiona datos existentes con nuevos
            : u
        )
      );
    } else {
      // Modo creación: agrega un nuevo usuario con ID auto-generado
      const newUser: User = {
        ...userData,
        id: Math.max(...this._users().map(u => u.id)) + 1  // Genera ID único
      };
      this._users.update(users => [...users, newUser]);
    }
    this.cancelForm();  // Cierra el modal después de guardar
  }

  /**
   * Método que cierra el modal y resetea el estado de edición
   * Se llama tanto al cancelar como al guardar exitosamente
   */
  cancelForm() {
    this.editingUser.set(null);
    this.showCreateForm.set(false);
  }
}
