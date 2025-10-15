import { Injectable } from '@angular/core';
import { AuthTokenResponse } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { User } from '../types/login.interface';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  login(email: string, password: string): Observable<AuthTokenResponse> {
    return from(
      this.supabaseService.supabase.auth.signInWithPassword({ email, password })
    );
  }

  logout(): Observable<any> {
    return from(this.supabaseService.supabase.auth.signOut());
  }

  getCurrentUser() {
    return from(this.supabaseService.supabase.auth.getUser());
  }

  isAuthenticated(): Observable<boolean> {
    return from(this.supabaseService.supabase.auth.getSession()).pipe(
      map(({ data }) => !!data.session)
    );
  }

  register(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users')!);
    if (users.some((u) => u.email === email)) {
      return false;
    }
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
}
