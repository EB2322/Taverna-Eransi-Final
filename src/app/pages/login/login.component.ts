import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  isError = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    const result = this.authService.login(this.username, this.password);
    this.message = result.message;
    this.isError = !result.ok;

    if (result.ok) {
      const isAdmin = this.authService.currentSession?.role === 'admin';
      void this.router.navigate([isAdmin ? '/admin' : '/menu']);
    }
  }
}
