import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export type UserRole = 'admin' | 'user';

interface StoredUser {
  username: string;
  password: string;
  role: UserRole;
}

export interface UserSession {
  username: string;
  role: UserRole;
}

interface AuthResult {
  ok: boolean;
  message: string;
}

export interface UserSummary {
  username: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly usersStorageKey = 'taverna-users';
  private readonly sessionStorageKey = 'taverna-session';
  private readonly isBrowser: boolean;

  private readonly sessionSubject = new BehaviorSubject<UserSession | null>(null);
  readonly session$ = this.sessionSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.ensureDefaultAdmin();
      this.restoreSession();
    }
  }

  get currentSession(): UserSession | null {
    return this.sessionSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentSession?.role === 'admin';
  }

  register(username: string, password: string): AuthResult {
    if (!this.isBrowser) {
      return { ok: false, message: 'Regjistrimi nuk eshte i disponueshem.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      return { ok: false, message: 'Ploteso username dhe password.' };
    }

    const users = this.readUsers();
    const alreadyExists = users.some((user) => user.username === cleanUsername);
    if (alreadyExists) {
      return { ok: false, message: 'Ky username ekziston.' };
    }

    users.push({
      username: cleanUsername,
      password: cleanPassword,
      role: 'user'
    });

    this.writeUsers(users);
    return { ok: true, message: 'Llogaria u krijua me sukses. Tani mund te besh login.' };
  }

  login(username: string, password: string): AuthResult {
    if (!this.isBrowser) {
      return { ok: false, message: 'Login nuk eshte i disponueshem.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const users = this.readUsers();

    const matchedUser = users.find(
      (user) => user.username === cleanUsername && user.password === cleanPassword
    );

    if (!matchedUser) {
      return { ok: false, message: 'Username ose password gabim.' };
    }

    const session: UserSession = {
      username: matchedUser.username,
      role: matchedUser.role
    };

    localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
    this.sessionSubject.next(session);
    return { ok: true, message: 'Login me sukses.' };
  }

  logout(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(this.sessionStorageKey);
    this.sessionSubject.next(null);
  }

  listUsers(): UserSummary[] {
    if (!this.isBrowser || !this.isAdmin) {
      return [];
    }

    return this.readUsers().map((user) => ({
      username: user.username,
      role: user.role
    }));
  }

  addUserByAdmin(username: string, password: string, role: UserRole = 'user'): AuthResult {
    if (!this.isBrowser || !this.isAdmin) {
      return { ok: false, message: 'Vetem admini mund te shtoje usera.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      return { ok: false, message: 'Ploteso username dhe password.' };
    }

    const users = this.readUsers();
    const alreadyExists = users.some((user) => user.username === cleanUsername);
    if (alreadyExists) {
      return { ok: false, message: 'Ky username ekziston.' };
    }

    users.push({
      username: cleanUsername,
      password: cleanPassword,
      role
    });

    this.writeUsers(users);
    return { ok: true, message: 'User-i u shtua me sukses.' };
  }

  deleteUserByAdmin(username: string): AuthResult {
    if (!this.isBrowser || !this.isAdmin) {
      return { ok: false, message: 'Vetem admini mund te fshije usera.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const session = this.currentSession;

    if (!cleanUsername) {
      return { ok: false, message: 'Username nuk eshte valid.' };
    }

    if (session?.username === cleanUsername) {
      return { ok: false, message: 'Nuk mund te fshish user-in aktual te loguar.' };
    }

    const users = this.readUsers();
    const targetUser = users.find((user) => user.username === cleanUsername);
    if (!targetUser) {
      return { ok: false, message: 'User-i nuk u gjet.' };
    }

    if (targetUser.role === 'admin') {
      const adminCount = users.filter((user) => user.role === 'admin').length;
      if (adminCount <= 1) {
        return { ok: false, message: 'Duhet te mbetet te pakten nje admin.' };
      }
    }

    const remainingUsers = users.filter((user) => user.username !== cleanUsername);
    this.writeUsers(remainingUsers);
    return { ok: true, message: 'User-i u fshi me sukses.' };
  }

  updateUserPasswordByAdmin(username: string, newPassword: string): AuthResult {
    if (!this.isBrowser || !this.isAdmin) {
      return { ok: false, message: 'Vetem admini mund te ndryshoje password.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = newPassword.trim();

    if (!cleanUsername || !cleanPassword) {
      return { ok: false, message: 'Username dhe password i ri jane te detyrueshme.' };
    }

    const users = this.readUsers();
    const targetUserIndex = users.findIndex((user) => user.username === cleanUsername);
    if (targetUserIndex === -1) {
      return { ok: false, message: 'User-i nuk u gjet.' };
    }

    users[targetUserIndex] = {
      ...users[targetUserIndex],
      password: cleanPassword
    };

    this.writeUsers(users);
    return { ok: true, message: `Password u ndryshua per ${cleanUsername}.` };
  }

  private ensureDefaultAdmin(): void {
    const users = this.readUsers();
    const hasAdmin = users.some((user) => user.role === 'admin');

    if (hasAdmin) {
      return;
    }

    users.push({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });

    this.writeUsers(users);
  }

  private restoreSession(): void {
    const storedSession = localStorage.getItem(this.sessionStorageKey);
    if (!storedSession) {
      return;
    }

    try {
      const parsed = JSON.parse(storedSession) as UserSession;
      if (!parsed.username || !parsed.role) {
        this.logout();
        return;
      }
      this.sessionSubject.next(parsed);
    } catch {
      this.logout();
    }
  }

  private readUsers(): StoredUser[] {
    const storedUsers = localStorage.getItem(this.usersStorageKey);
    if (!storedUsers) {
      return [];
    }

    try {
      return JSON.parse(storedUsers) as StoredUser[];
    } catch {
      return [];
    }
  }

  private writeUsers(users: StoredUser[]): void {
    localStorage.setItem(this.usersStorageKey, JSON.stringify(users));
  }
}
