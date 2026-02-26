import { Component } from '@angular/core';
import { SiteSettings, SiteSettingsService } from '../../core/site-settings.service';

type SiteSettingsDraft = Pick<
  SiteSettings,
  | 'brandTitle'
  | 'brandSubtitle'
  | 'homeEyebrow'
  | 'homeTitle'
  | 'homeLead'
  | 'phoneNumber'
  | 'backgroundImageUrl'
  | 'colorBg'
  | 'colorPaper'
  | 'colorInk'
  | 'colorBrand'
  | 'colorBrandStrong'
  | 'footerDescription'
  | 'footerHoursTitle'
  | 'footerHours'
  | 'footerContactTitle'
  | 'footerWhatsappLabel'
  | 'footerLocationPrefix'
  | 'footerLocationUrl'
  | 'footerLocationLabel'
  | 'footerCopyrightName'
  | 'featureOneTitle'
  | 'featureOneText'
  | 'featureTwoTitle'
  | 'featureTwoText'
  | 'featureThreeTitle'
  | 'featureThreeText'
>;

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  message = '';
  isError = false;
  siteSettingsDraft: SiteSettingsDraft = {
    brandTitle: '',
    brandSubtitle: '',
    homeEyebrow: '',
    homeTitle: '',
    homeLead: '',
    phoneNumber: '',
    backgroundImageUrl: '',
    colorBg: '#f6f2e8',
    colorPaper: '#fffdf8',
    colorInk: '#1f2430',
    colorBrand: '#a14f2f',
    colorBrandStrong: '#7e3518',
    footerDescription: '',
    footerHoursTitle: '',
    footerHours: '',
    footerContactTitle: '',
    footerWhatsappLabel: '',
    footerLocationPrefix: '',
    footerLocationUrl: '',
    footerLocationLabel: '',
    footerCopyrightName: '',
    featureOneTitle: '',
    featureOneText: '',
    featureTwoTitle: '',
    featureTwoText: '',
    featureThreeTitle: '',
    featureThreeText: ''
  };

  constructor(private readonly siteSettingsService: SiteSettingsService) {
    this.loadDraft();
  }

  save(): void {
    this.siteSettingsService.updateSettings(this.siteSettingsDraft);
    this.loadDraft();
    this.message = 'Cilesimet u ruajten me sukses.';
    this.isError = false;
  }

  private loadDraft(): void {
    const current = this.siteSettingsService.currentSettings;
    this.siteSettingsDraft = {
      brandTitle: current.brandTitle,
      brandSubtitle: current.brandSubtitle,
      homeEyebrow: current.homeEyebrow,
      homeTitle: current.homeTitle,
      homeLead: current.homeLead,
      phoneNumber: current.phoneNumber,
      backgroundImageUrl: current.backgroundImageUrl,
      colorBg: current.colorBg,
      colorPaper: current.colorPaper,
      colorInk: current.colorInk,
      colorBrand: current.colorBrand,
      colorBrandStrong: current.colorBrandStrong,
      footerDescription: current.footerDescription,
      footerHoursTitle: current.footerHoursTitle,
      footerHours: current.footerHours,
      footerContactTitle: current.footerContactTitle,
      footerWhatsappLabel: current.footerWhatsappLabel,
      footerLocationPrefix: current.footerLocationPrefix,
      footerLocationUrl: current.footerLocationUrl,
      footerLocationLabel: current.footerLocationLabel,
      footerCopyrightName: current.footerCopyrightName,
      featureOneTitle: current.featureOneTitle,
      featureOneText: current.featureOneText,
      featureTwoTitle: current.featureTwoTitle,
      featureTwoText: current.featureTwoText,
      featureThreeTitle: current.featureThreeTitle,
      featureThreeText: current.featureThreeText
    };
  }
}
