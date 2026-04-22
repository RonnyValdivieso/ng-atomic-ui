import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';
import { LoginDto } from '@interfaces/auth.interface';
import { ButtonComponent } from '@atoms/button';
import { FormFieldComponent } from '@molecules/form-field';
import { CardComponent } from '@atoms/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    CardComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  error: string | null = null;

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.isLoading = true;
    this.error = null;

    const credentials = this.loginForm.value as LoginDto;

    this.auth.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
        if (redirectTo) {
          this.router.navigateByUrl(redirectTo);
          return;
        }
        const target = this.auth.isSuperAdmin() ? '/admin' : '/workspace-selector';
        this.router.navigateByUrl(target);
      },
      error: (err) => {
        this.error = 'Invalid credentials. Please try again.';
        this.isLoading = false;
        console.error('Login error:', err);
      }
    });
  }
}
