import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface SiteSettings {
  brandTitle: string;
  brandSubtitle: string;
  homeEyebrow: string;
  homeTitle: string;
  homeLead: string;
  phoneNumber: string;
  backgroundImageUrl: string;
  colorBg: string;
  colorPaper: string;
  colorInk: string;
  colorBrand: string;
  colorBrandStrong: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  brandTitle: 'Taverna Eransi',
  brandSubtitle: 'Shije tradicionale prane liqenit',
  homeEyebrow: 'Mire se vini',
  homeTitle: 'Kuzhine tradicionale shqiptare me shije moderne',
  homeLead:
    'Nga peshku i fresket deri te gatimet e taves, Taverna Eransi sjell receta autentike ne nje ambient te ngrohte familjar.',
  phoneNumber: '+355692755666',
  backgroundImageUrl:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=80',
  colorBg: '#f6f2e8',
  colorPaper: '#fffdf8',
  colorInk: '#1f2430',
  colorBrand: '#a14f2f',
  colorBrandStrong: '#7e3518'
};

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private readonly storageKey = 'taverna-site-settings';
  private readonly isBrowser: boolean;
  private readonly settingsSubject = new BehaviorSubject<SiteSettings>(DEFAULT_SETTINGS);
  readonly settings$ = this.settingsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) {
      return;
    }

    const restored = this.restoreSettings();
    this.settingsSubject.next(restored);
    this.applyTheme(restored);
  }

  get currentSettings(): SiteSettings {
    return this.settingsSubject.value;
  }

  updateSettings(nextInput: Partial<SiteSettings>): SiteSettings {
    const merged = this.normalizeSettings({ ...this.currentSettings, ...nextInput });
    this.settingsSubject.next(merged);
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(merged));
      this.applyTheme(merged);
    }
    return merged;
  }

  getWhatsappLink(message = 'Pershendetje, dua te bej nje rezervim ne Taverna Eransi.'): string {
    const digits = this.currentSettings.phoneNumber.replace(/[^\d+]/g, '');
    const normalized = digits.startsWith('+') ? digits.slice(1) : digits;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  }

  private restoreSettings(): SiteSettings {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<SiteSettings>;
      return this.normalizeSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } catch {
      localStorage.removeItem(this.storageKey);
      return DEFAULT_SETTINGS;
    }
  }

  private normalizeSettings(input: Partial<SiteSettings>): SiteSettings {
    return {
      brandTitle: this.normalizeText(input.brandTitle, DEFAULT_SETTINGS.brandTitle),
      brandSubtitle: this.normalizeText(input.brandSubtitle, DEFAULT_SETTINGS.brandSubtitle),
      homeEyebrow: this.normalizeText(input.homeEyebrow, DEFAULT_SETTINGS.homeEyebrow),
      homeTitle: this.normalizeText(input.homeTitle, DEFAULT_SETTINGS.homeTitle),
      homeLead: this.normalizeText(input.homeLead, DEFAULT_SETTINGS.homeLead),
      phoneNumber: this.normalizeText(input.phoneNumber, DEFAULT_SETTINGS.phoneNumber),
      backgroundImageUrl: this.normalizeText(input.backgroundImageUrl, DEFAULT_SETTINGS.backgroundImageUrl),
      colorBg: this.normalizeColor(input.colorBg, DEFAULT_SETTINGS.colorBg),
      colorPaper: this.normalizeColor(input.colorPaper, DEFAULT_SETTINGS.colorPaper),
      colorInk: this.normalizeColor(input.colorInk, DEFAULT_SETTINGS.colorInk),
      colorBrand: this.normalizeColor(input.colorBrand, DEFAULT_SETTINGS.colorBrand),
      colorBrandStrong: this.normalizeColor(input.colorBrandStrong, DEFAULT_SETTINGS.colorBrandStrong)
    };
  }

  private normalizeText(value: string | undefined, fallback: string): string {
    const clean = value?.trim();
    return clean || fallback;
  }

  private normalizeColor(value: string | undefined, fallback: string): string {
    const clean = value?.trim();
    return clean || fallback;
  }

  private applyTheme(settings: SiteSettings): void {
    const root = document.documentElement;
    root.style.setProperty('--bg', settings.colorBg);
    root.style.setProperty('--paper', settings.colorPaper);
    root.style.setProperty('--ink', settings.colorInk);
    root.style.setProperty('--brand', settings.colorBrand);
    root.style.setProperty('--brand-strong', settings.colorBrandStrong);
    root.style.setProperty('--bg-image', `url('${settings.backgroundImageUrl}')`);
  }
}
