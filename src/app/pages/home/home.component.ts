import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SiteSettings, SiteSettingsService } from '../../core/site-settings.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly settings$: Observable<SiteSettings>;

  constructor(private readonly siteSettingsService: SiteSettingsService) {
    this.settings$ = this.siteSettingsService.settings$;
  }

  get whatsappLink(): string {
    return this.siteSettingsService.getWhatsappLink();
  }

}
