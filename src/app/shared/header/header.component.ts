import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserSession } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly session$: Observable<UserSession | null>;

  constructor(private readonly authService: AuthService) {
    this.session$ = this.authService.session$;
  }

  logout(): void {
    this.authService.logout();
  }
}
