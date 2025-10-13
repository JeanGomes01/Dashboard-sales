import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginSuccess = this.authService.login(email, password);

      if (loginSuccess) {
        this.showFeedback('Login efetuado com sucesso!', 'success');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      } else {
        this.showFeedback('Usuário ou senha incorretos!', 'error');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => {
      this.feedbackMessage = null;
      this.feedbackType = null;
    }, 3000);
  }
}
