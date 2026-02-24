import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  host: {
    'class': 'block w-full h-screen'
  }
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form valid:', this.loginForm.valid);
    console.log('Form values:', this.loginForm.value);
    console.log('Form errors:', this.loginForm.errors);
    
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: (success) => {
          console.log('Login result:', success);
          this.isLoading = false;
          if (success) {
            this.router.navigate(['/']);
          } else {
            this.errorMessage = 'Credenciales incorrectas';
          }
        },
        error: (error) => {
          console.log('Login error:', error);
          this.isLoading = false;
          this.errorMessage = 'Error al iniciar sesión';
        }
      });
    }
  }
}
