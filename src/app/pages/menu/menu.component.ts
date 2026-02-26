import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService, UserRole, UserSummary } from '../../core/auth.service';
import { SiteSettings, SiteSettingsService } from '../../core/site-settings.service';

interface MenuItem {
  name: string;
  price: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
  note?: string;
}

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
>;

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  readonly pageTitle = 'Menu / Menu';
  private readonly storageKey = 'taverna-menu-sections';
  private readonly isBrowser: boolean;
  private readonly sectionIdPrefix = 'cat-';
  private sectionIdCounter = 1;

  sections: MenuSection[] = [
    {
      id: 'cat-1',
      title: 'Sallata / Salads',
      items: [
        { name: 'Sallat fshati / Village salad', price: '350 L' },
        { name: 'Sallat mix / Mix salad', price: '450 L' },
        { name: 'Sallat ulliri / Olives salad', price: '250 L' },
        { name: 'Sallat jeshile / Green salad', price: '300 L' },
        { name: 'Sallat Cezar / Cezar salad', price: '500 L' },
        { name: 'Sallat rukola / Arugula salad', price: '500 L' },
        { name: 'Perime te pjekura', price: '400 L' }
      ]
    },
    {
      id: 'cat-2',
      title: 'Shoqeruese',
      items: [
        { name: 'Xaxiq (Tzatziki)', price: '300 L' },
        { name: 'Salce kosi (Sour cream)', price: '250 L' },
        { name: 'Patate te skuqura (Fries)', price: '250 L' },
        { name: 'Djath i bardhe (Feta cheese)', price: '250 L' },
        { name: 'Kackavall i skuqur (Fried cheese)', price: '350 L' },
        { name: 'Djath furre (Oven baked cheese)', price: '400 L' },
        { name: 'Patate furre (Baked potatoes)', price: '400 L' },
        { name: 'Fergese ne tave balte', price: '400 L' },
        { name: 'Speca me kackavall', price: '400 L' }
      ]
    },
    {
      id: 'cat-3',
      title: 'Supa / Soup',
      items: [
        { name: 'Supe peshku / Fish soup', price: '350 L' },
        { name: 'Supe pule / Chicken soup', price: '300 L' },
        { name: 'Supe perime / Vegetable soup', price: '300 L' }
      ]
    },
    {
      id: 'cat-4',
      title: 'Pasta',
      items: [
        { name: 'Linguini fruta deti / Linguini sea food', price: '700 L' },
        { name: 'Spaghetti pana kerpudha', price: '500 L' },
        { name: 'Makarona me gjalpe', price: '300 L' }
      ]
    },
    {
      id: 'cat-5',
      title: 'Risotto',
      items: [
        { name: 'Risotto fileto pule pana', price: '700 L' },
        { name: 'Risotto perime / Risotto with vegetables', price: '400 L' },
        { name: 'Risotto fruta deti / Risotto with sea food', price: '700 L' }
      ]
    },
    {
      id: 'cat-6',
      title: 'Peshk / Fish',
      items: [
        { name: 'Koran ne zgarre / Grilled Koran (350 g)', price: 'Sipas peshes' },
        { name: 'Koran ne zgarre / Grilled Koran (1 kg)', price: 'Sipas peshes' },
        { name: 'Belushke ne zgarre / Grilled Belushke (350 g)', price: 'Sipas peshes' },
        { name: 'Belushke ne zgarre / Grilled Belushke (1 kg)', price: 'Sipas peshes' },
        { name: 'Trofte ne zgarre / Grilled trout (500 g)', price: '800 L' },
        { name: 'Trofte ne zgarre / Grilled trout (1 kg)', price: '1500 L' },
        { name: 'Levrek ne zgarre / Grilled levrek (500 g)', price: '1200 L' },
        { name: 'Koce ne zgarre / Grilled koce (500 g)', price: '1200 L' },
        { name: 'Tave korani / Koran casserole (1 kg)', price: 'Sipas peshes' },
        { name: 'Tave belushke / Belushke casserole (1 kg)', price: 'Sipas peshes' },
        { name: 'Tave trofte / Trout casserole (1 kg)', price: '1800 L' }
      ],
      note: '"Sipas peshes" = cmimi varet nga pesha (kg).'
    },
    {
      id: 'cat-7',
      title: 'Mish / Meat',
      items: [
        { name: 'Biftek vici / Beef steak (350 g)', price: '1100 L' },
        { name: 'Biftek vici / Beef steak (1 kg)', price: '2400 L' },
        { name: 'Berxolle vici / Veal chops (350 g)', price: '1100 L' },
        { name: 'Berxolle vici / Veal chops (1 kg)', price: '2400 L' },
        { name: 'Brinje vici ne zgarre / Grilled veal ribs (350 g)', price: '1100 L' },
        { name: 'Brinje vici ne zgarre / Grilled veal ribs (1 kg)', price: '2400 L' },
        { name: 'Fileto pule ne zgarre / Grilled chicken fillet (400 g)', price: '700 L' },
        { name: 'Fileto pule ne zgarre / Grilled chicken fillet (1 kg)', price: '1200 L' },
        { name: 'Mix mishi / Mixed meats', price: '2500 / 3500 / 5000 L' },
        { name: 'Shpretke e mbushur (350 g)', price: '800 L' },
        { name: 'Shpretke e mbushur ne tave balte (350 g)', price: '800 L' },
        { name: 'Shpretke e mbushur ne tave balte (2 persona)', price: '1500 L' },
        { name: 'Pule e tiganisur (2 persona)', price: '1300 L' },
        { name: 'Pule e tiganisur (4 persona)', price: '2500 L' },
        { name: 'Pule me buke misri (2 persona)', price: '1300 L' },
        { name: 'Pule me buke misri (4 persona)', price: '2500 L' },
        { name: 'Pule me jufka & petka (2 persona)', price: '1300 L' },
        { name: 'Pule me jufka & petka (4 persona)', price: '2500 L' },
        { name: 'Lakror tradicional / Traditional pie', price: '1500 L' }
      ]
    },
    {
      id: 'cat-8',
      title: 'Pije te ngrohta',
      items: [
        { name: 'Ekspres', price: '90 L' },
        { name: 'Makiato', price: '90 L' },
        { name: 'Americano', price: '110 L' },
        { name: 'Kapucino', price: '110 L' },
        { name: 'Cokollate e ngrohte', price: '120 L' },
        { name: 'Kakao', price: '120 L' },
        { name: 'Salep', price: '120 L' },
        { name: 'Caj', price: '80 L' }
      ]
    },
    {
      id: 'cat-9',
      title: 'Pije te ftohta',
      items: [
        { name: 'Uje i vogel', price: '50 L' },
        { name: 'Uje i madh', price: '150 L' },
        { name: 'Uje me gas', price: '80 L' },
        { name: 'Uje vitamin', price: '90 L' },
        { name: 'Coca Cola', price: '120 L' },
        { name: 'Fanta', price: '120 L' },
        { name: 'Bravo', price: '120 L' },
        { name: 'Caj i ftohte', price: '120 L' },
        { name: 'Soda', price: '120 L' },
        { name: 'Frutomania', price: '170 L' },
        { name: 'Schweppes', price: '120 L' },
        { name: 'Redbull', price: '250 L' }
      ]
    },
    {
      id: 'cat-10',
      title: 'Birrat',
      items: [
        { name: 'Budweiser i vogel', price: '200 L' },
        { name: 'Budweiser i madh', price: '250 L' },
        { name: 'Erdinger (Helles, Kristal, i turbull)', price: '300 L' },
        { name: 'Korca', price: '200 L' },
        { name: 'Stella Artois', price: '200 L' },
        { name: 'Peroni', price: '200 L' },
        { name: 'Bavaria 0.0% ALC', price: '200 L' }
      ]
    },
    {
      id: 'cat-11',
      title: 'Alkoolike',
      items: [
        { name: 'Chivas Regal 12', price: '300 L' },
        { name: 'Jack Daniels', price: '300 L' },
        { name: 'Red Label', price: '300 L' },
        { name: 'Gin Gordon\'s', price: '250 L' },
        { name: 'Gin Tanqueray', price: '350 L' },
        { name: 'Gin Bombay', price: '350 L' },
        { name: 'Gin Hendrick\'s', price: '350 L' },
        { name: 'Disaronno', price: '350 L' },
        { name: 'Johnny Walker (Black/Red)', price: '350 L' },
        { name: 'J&B', price: '350 L' },
        { name: 'Glenfiddich', price: '450 L' },
        { name: 'Ballantine\'s', price: '450 L' },
        { name: 'Vodka Absolut', price: '350 L' },
        { name: 'Vodka Finlandia', price: '300 L' },
        { name: 'Puschkin', price: '250 L' },
        { name: 'Grey Goose', price: '500 L' },
        { name: 'Belvedere', price: '600 L' },
        { name: 'Metaxa 5', price: '300 L' },
        { name: 'Metaxa 7', price: '400 L' },
        { name: 'Metaxa 12', price: '550 L' },
        { name: 'Hennessy', price: '600 L' },
        { name: 'Diplomatico', price: '1200 L' },
        { name: 'Bacardi', price: '450 L' },
        { name: 'Tequila', price: '250 L' },
        { name: 'Martini', price: '300 L' },
        { name: 'Amaro Montenegro', price: '300 L' },
        { name: 'Amaro del Capo', price: '350 L' },
        { name: 'Campari', price: '350 L' },
        { name: 'Aperol', price: '350 L' },
        { name: 'Malibu', price: '350 L' },
        { name: 'Fernet Branca', price: '350 L' }
      ]
    }
  ];

  newSectionTitle = '';
  newSectionNote = '';
  newUserUsername = '';
  newUserPassword = '';
  newUserRole: UserRole = 'user';
  userMessage = '';
  userMessageError = false;
  settingsMessage = '';
  settingsMessageError = false;
  users: UserSummary[] = [];
  userPasswordDrafts: Record<string, string> = {};
  sectionPositionDrafts: Record<string, string> = {};
  sectionDraftItems: MenuItem[] = [];
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
    colorBrandStrong: '#7e3518'
  };

  constructor(
    private readonly authService: AuthService,
    private readonly siteSettingsService: SiteSettingsService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.restoreSections();
    this.sections = this.normalizeSections(this.sections);
    this.syncSectionDraftItems();
    this.refreshUsers();
    this.loadSiteSettingsDraft();
  }

  get canEditPrices(): boolean {
    return this.isLoggedIn;
  }

  get canManageUsers(): boolean {
    return this.authService.isAdmin;
  }

  get canManageMenuStructure(): boolean {
    return this.authService.isAdmin;
  }

  get isLoggedIn(): boolean {
    return !!this.authService.currentSession;
  }

  saveSections(): void {
    if (!this.isBrowser || !this.canEditPrices) {
      return;
    }

    this.sections = this.normalizeSections(this.sections);
    localStorage.setItem(this.storageKey, JSON.stringify(this.sections));
    this.syncSectionDraftItems();
  }

  addSection(): void {
    if (!this.canManageMenuStructure) {
      return;
    }

    const title = this.newSectionTitle.trim();
    if (!title) {
      return;
    }

    const note = this.newSectionNote.trim();
    this.sections.push({
      id: this.createSectionId(),
      title,
      items: [],
      ...(note ? { note } : {})
    });
    this.newSectionTitle = '';
    this.newSectionNote = '';
    this.saveSections();
  }

  removeSection(sectionIndex: number): void {
    if (!this.canManageMenuStructure || sectionIndex < 0 || sectionIndex >= this.sections.length) {
      return;
    }

    this.sections.splice(sectionIndex, 1);
    this.saveSections();
  }

  moveSectionUp(sectionIndex: number): void {
    if (!this.canManageMenuStructure || sectionIndex <= 0 || sectionIndex >= this.sections.length) {
      return;
    }

    const current = this.sections[sectionIndex];
    this.sections[sectionIndex] = this.sections[sectionIndex - 1];
    this.sections[sectionIndex - 1] = current;
    this.saveSections();
  }

  moveSectionDown(sectionIndex: number): void {
    if (!this.canManageMenuStructure || sectionIndex < 0 || sectionIndex >= this.sections.length - 1) {
      return;
    }

    const current = this.sections[sectionIndex];
    this.sections[sectionIndex] = this.sections[sectionIndex + 1];
    this.sections[sectionIndex + 1] = current;
    this.saveSections();
  }

  moveSectionToPosition(sectionIndex: number, targetPositionRaw: string | number | null | undefined): void {
    if (!this.canManageMenuStructure || sectionIndex < 0 || sectionIndex >= this.sections.length) {
      return;
    }

    const rawValue =
      targetPositionRaw === null || targetPositionRaw === undefined
        ? ''
        : String(targetPositionRaw).trim();
    const targetPosition = Number.parseInt(rawValue, 10);
    if (Number.isNaN(targetPosition)) {
      return;
    }

    const normalizedTargetIndex = Math.min(
      Math.max(targetPosition - 1, 0),
      this.sections.length - 1
    );
    if (normalizedTargetIndex === sectionIndex) {
      return;
    }

    const currentSection = this.sections[sectionIndex];
    const targetSection = this.sections[normalizedTargetIndex];
    this.sections[sectionIndex] = targetSection;
    this.sections[normalizedTargetIndex] = currentSection;
    this.saveSections();
  }

  addItem(sectionIndex: number): void {
    if (!this.canManageMenuStructure || sectionIndex < 0 || sectionIndex >= this.sections.length) {
      return;
    }

    const draft = this.sectionDraftItems[sectionIndex];
    const name = draft?.name?.trim() ?? '';
    const price = draft?.price?.trim() ?? '';

    if (!name || !price) {
      return;
    }

    this.sections[sectionIndex].items.push({ name, price });
    this.sectionDraftItems[sectionIndex] = { name: '', price: '' };
    this.saveSections();
  }

  removeItem(sectionIndex: number, itemIndex: number): void {
    if (!this.canManageMenuStructure || sectionIndex < 0 || sectionIndex >= this.sections.length) {
      return;
    }

    const items = this.sections[sectionIndex].items;
    if (itemIndex < 0 || itemIndex >= items.length) {
      return;
    }

    items.splice(itemIndex, 1);
    this.saveSections();
  }

  addUser(): void {
    if (!this.canManageUsers) {
      return;
    }

    const result = this.authService.addUserByAdmin(
      this.newUserUsername,
      this.newUserPassword,
      this.newUserRole
    );

    this.userMessage = result.message;
    this.userMessageError = !result.ok;

    if (!result.ok) {
      return;
    }

    this.newUserUsername = '';
    this.newUserPassword = '';
    this.newUserRole = 'user';
    this.refreshUsers();
  }

  deleteUser(username: string): void {
    if (!this.canManageUsers) {
      return;
    }

    const result = this.authService.deleteUserByAdmin(username);
    this.userMessage = result.message;
    this.userMessageError = !result.ok;
    this.refreshUsers();
  }

  updateUserPassword(username: string): void {
    if (!this.canManageUsers) {
      return;
    }

    const newPassword = this.userPasswordDrafts[username] ?? '';
    const result = this.authService.updateUserPasswordByAdmin(username, newPassword);
    this.userMessage = result.message;
    this.userMessageError = !result.ok;

    if (result.ok) {
      this.userPasswordDrafts[username] = '';
    }
  }

  saveSiteSettings(): void {
    if (!this.canManageMenuStructure) {
      return;
    }

    this.siteSettingsService.updateSettings(this.siteSettingsDraft);
    this.loadSiteSettingsDraft();
    this.settingsMessage = 'Cilesimet e faqes u ruajten me sukses.';
    this.settingsMessageError = false;
  }

  private restoreSections(): void {
    if (!this.isBrowser) {
      return;
    }

    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        this.sections = this.normalizeSections(parsed);
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  private createSectionId(): string {
    const existingIds = new Set(this.sections.map((section) => section.id));
    while (existingIds.has(`${this.sectionIdPrefix}${this.sectionIdCounter}`)) {
      this.sectionIdCounter += 1;
    }
    const id = `${this.sectionIdPrefix}${this.sectionIdCounter}`;
    this.sectionIdCounter += 1;
    return id;
  }

  private normalizeSections(sectionsInput: unknown[]): MenuSection[] {
    const normalized: MenuSection[] = [];
    const usedIds = new Set<string>();
    let maxNumericId = 0;

    for (const candidate of sectionsInput) {
      if (!candidate || typeof candidate !== 'object') {
        continue;
      }

      const raw = candidate as Partial<MenuSection>;
      const title = typeof raw.title === 'string' ? raw.title.trim() : '';
      const items = Array.isArray(raw.items)
        ? raw.items.filter((item): item is MenuItem => {
            return !!item && typeof item.name === 'string' && typeof item.price === 'string';
          })
        : [];

      if (!title) {
        continue;
      }

      let id = typeof raw.id === 'string' ? raw.id.trim() : '';
      if (!id || usedIds.has(id)) {
        id = this.createFallbackId(usedIds);
      }

      const match = id.match(/^cat-(\d+)$/);
      if (match) {
        maxNumericId = Math.max(maxNumericId, Number(match[1]));
      }

      usedIds.add(id);
      normalized.push({
        id,
        title,
        items,
        ...(typeof raw.note === 'string' && raw.note.trim() ? { note: raw.note.trim() } : {})
      });
    }

    this.sectionIdCounter = Math.max(this.sectionIdCounter, maxNumericId + 1);
    return normalized;
  }

  private createFallbackId(usedIds: Set<string>): string {
    let counter = this.sectionIdCounter;
    let id = `${this.sectionIdPrefix}${counter}`;
    while (usedIds.has(id)) {
      counter += 1;
      id = `${this.sectionIdPrefix}${counter}`;
    }
    this.sectionIdCounter = counter + 1;
    return id;
  }

  private syncSectionDraftItems(): void {
    this.sectionDraftItems = this.sections.map(() => ({ name: '', price: '' }));
    this.syncSectionPositionDrafts();
  }

  private syncSectionPositionDrafts(): void {
    this.sectionPositionDrafts = this.sections.reduce<Record<string, string>>((acc, section, index) => {
      acc[section.id] = String(index + 1);
      return acc;
    }, {});
  }

  private refreshUsers(): void {
    if (!this.canManageUsers) {
      this.users = [];
      this.userPasswordDrafts = {};
      return;
    }
    this.users = this.authService.listUsers();
    this.syncUserPasswordDrafts();
  }

  private syncUserPasswordDrafts(): void {
    const currentDrafts = this.userPasswordDrafts;
    this.userPasswordDrafts = this.users.reduce<Record<string, string>>((acc, user) => {
      acc[user.username] = currentDrafts[user.username] ?? '';
      return acc;
    }, {});
  }

  private loadSiteSettingsDraft(): void {
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
      colorBrandStrong: current.colorBrandStrong
    };
  }
}
