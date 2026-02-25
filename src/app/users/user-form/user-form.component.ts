import { Component, input, output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../users.component';

/**
 * Interfaz que define la estructura de datos del formulario de usuario
 * Excluye el campo 'id' ya que se genera automáticamente para nuevos usuarios
 */
export interface UserFormData {
  name: string;                                    // Nombre completo del usuario
  email: string;                                   // Email del usuario
  company: string;                                 // Empresa asignada
  role: 'CLIENT ADMIN' | 'SUPER ADMIN' | 'USER' | 'VIEWER';  // Rol del usuario
  status: 'active' | 'inactive';                  // Estado del usuario
}

/**
 * Componente de formulario para crear y editar usuarios
 * 
 * Este componente maneja el formulario modal que permite tanto crear nuevos usuarios
 * como editar usuarios existentes. Utiliza ReactiveForms de Angular para la gestión
 * del estado del formulario y validaciones.
 * 
 * Funcionalidades principales:
 * - Formulario con validaciones en tiempo real
 * - Modo creación vs modo edición (determinado por el input user)
 * - Pre-población de datos en modo edición
 * - Validaciones personalizadas (email, required, minLength)
 * - Emisión de eventos al componente padre (save, cancel)
 * 
 * Flujo de trabajo:
 * 1. Componente padre abre el modal pasando user=null (creación) o user=User (edición)
 * 2. Componente inicializa el formulario con datos vacíos o existentes
 * 3. Usuario completa/modifica los datos
 * 4. Al submit, valida y emite evento save con los datos
 * 5. Al cancelar, emite evento cancel
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  /**
   * Input opcional que contiene el usuario a editar
   * - null: modo creación (formulario vacío)
   * - User: modo edición (formulario pre-poblado)
   */
  user = input<User | null>(null);
  
  /**
   * Output que se emite cuando el formulario se guarda exitosamente
   * Envía los datos del formulario validados
   */
  save = output<UserFormData>();
  
  /**
   * Output que se emite cuando el usuario cancela la operación
   * No envía datos, solo indica que se debe cerrar el modal
   */
  cancel = output<void>();

  /**
   * FormGroup que maneja el estado y validaciones del formulario
   * Utiliza FormBuilder para la configuración declarativa
   */
  userForm: FormGroup;

  /**
   * Constructor que inicializa el formulario con validaciones
   * @param fb - FormBuilder inyectado para crear el FormGroup
   */
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],  // Nombre requerido, mínimo 2 caracteres
      email: ['', [Validators.required, Validators.email]],        // Email requerido y válido
      company: ['', [Validators.required]],                       // Empresa requerida
      role: ['USER', [Validators.required]],                       // Rol requerido, por defecto USER
      status: ['active', [Validators.required]]                    // Estado requerido, por defecto active
    });
  }

  /**
   * Lifecycle hook que se ejecuta después de inicializar el componente
   * Verifica si hay un usuario para editar y pre-pobla el formulario
   */
  ngOnInit() {
    if (this.user()) {
      const userData = this.user()!;
      this.userForm.patchValue({
        name: userData.name,
        email: userData.email,
        company: userData.company,
        role: userData.role,
        status: userData.status
      });
    }
  }

  /**
   * Método que se ejecuta al enviar el formulario
   * Valida el formulario y emite el evento save si es válido
   * No se envía el campo 'id' ya que se maneja externamente
   */
  onSubmit() {
    if (this.userForm.valid) {
      this.save.emit(this.userForm.value);
    }
  }
}
