import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserSession } from '../../core/auth.service';
import { SiteSettings, SiteSettingsService } from '../../core/site-settings.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly session$: Observable<UserSession | null>;
  readonly settings$: Observable<SiteSettings>;

  constructor(
    private readonly authService: AuthService,
    private readonly siteSettingsService: SiteSettingsService
  ) {
    this.session$ = this.authService.session$;
    this.settings$ = this.siteSettingsService.settings$;
  }

  get isAdminLoggedIn(): boolean {
    return this.authService.currentSession?.role === 'admin';
  }

  logout(): void {
    this.authService.logout();
  }
}
