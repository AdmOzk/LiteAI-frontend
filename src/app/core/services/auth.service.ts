import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { API_BASE_URL } from '../config/api.config';
import { tap } from 'rxjs';

const TOKEN_KEY = 'liteai_token';
const USERNAME_KEY = 'liteai_user_name';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {}
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(safeGet(TOKEN_KEY));
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));
  readonly displayName = signal<string | null>(safeGet(USERNAME_KEY));

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/Auth/login`, body).pipe(
      tap((response) => {
        safeSet(TOKEN_KEY, response.token);
        this.tokenSignal.set(response.token);

        if (response.userName) {
          safeSet(USERNAME_KEY, response.userName);
          this.displayName.set(response.userName);
        }
      })
    );
  }

  register(body: RegisterRequest) {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/Auth/register`, body).pipe(
      tap((response) => {
        if (response.token) {
          safeSet(TOKEN_KEY, response.token);
          this.tokenSignal.set(response.token);
        }

        const preferredName = response.userName ?? `${body.firstName} ${body.lastName}`.trim();
        if (preferredName) {
          safeSet(USERNAME_KEY, preferredName);
          this.displayName.set(preferredName);
        }
      })
    );
  }

  logout() {
    safeRemove(TOKEN_KEY);
    safeRemove(USERNAME_KEY);
    this.tokenSignal.set(null);
    this.displayName.set(null);
    this.router.navigate(['/login']);
  }

  get token(): string | null {
    return this.tokenSignal();
  }
}
