import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SiteSettings, SiteSettingsService } from '../../core/site-settings.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
 styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  readonly settings$: Observable<SiteSettings>;

  constructor(private readonly siteSettingsService: SiteSettingsService) {
    this.settings$ = this.siteSettingsService.settings$;
  }

  get whatsappLink(): string {
    return this.siteSettingsService.getWhatsappLink();
  }

}
