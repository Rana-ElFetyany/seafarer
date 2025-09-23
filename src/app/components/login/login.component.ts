import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenResponse } from '../../core/interfaces/token-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  isBtnSubmit = false;
  errorMessage = '';

  loginForm: FormGroup = this._FormBuilder.group({
    username: [null, Validators.required],
    password: [null, Validators.required],
    mobileid: ['9cb2fcb2de1c71e8'], // ثابت مؤقتاً
  });

  sendData() {
    this.isBtnSubmit = true;

    if (this.loginForm.valid) {
      this._AuthService.login(this.loginForm.value).subscribe({
        next: (res: TokenResponse) => {
          console.log('✅ Logged in:', res);
          localStorage.setItem('token', res.access_token);

          this._Router.navigateByUrl('/seafarers-list');
        },
        error: (err) => {
          console.error('❌ Login error:', err);
          this.errorMessage = err.error?.error_description || 'Login failed';
        },
      });
    } else {
      this.errorMessage = 'Please fill all fields';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
  }
}
