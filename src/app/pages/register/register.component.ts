import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  message = '';
  isError = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.message = 'Password-et nuk perputhen.';
      this.isError = true;
      return;
    }

    const result = this.authService.register(this.username, this.password);
    this.message = result.message;
    this.isError = !result.ok;

    if (result.ok) {
      setTimeout(() => {
        void this.router.navigate(['/login']);
      }, 700);
    }
  }
}
