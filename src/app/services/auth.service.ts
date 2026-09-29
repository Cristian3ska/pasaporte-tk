import { Injectable, signal, computed } from '@angular/core';

export type Role = 'USER' | 'CAFE_ADMIN' | 'SUPER_ADMIN';

export interface UserAvatar {
  icon: string;
  iconColor: string;
  bgColor: string;
}

export interface User {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO string
  codigoActivacion: string; // Para admins puede ser su username/ID
  password?: string;
  avatar?: UserAvatar;
  creadoEn: string; // ISO date
  role: Role;
  cafeId?: string; // Solo para CAFE_ADMIN, id de la cafetería asignada
}

const STORAGE_KEY = 'pasaporte_user';
const USERS_KEY = 'pasaporte_users';

// Códigos de activación válidos (impresos en el pasaporte físico)
export const CODIGOS_VALIDOS = [
  'CAFE-2026-DEMO',
  'CAFE-2026-A001',
  'CAFE-2026-A002',
  'CAFE-2026-B001',
  'CAFE-2026-B002',
  'CAFE-2026-C001',
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(this._loadUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly profileOpen = signal(false);

  toggleProfile(): void {
    this.profileOpen.set(!this.profileOpen());
  }

  /** Verifica si el código es válido y no ha sido usado */
  validateCode(code: string): boolean {
    return CODIGOS_VALIDOS.includes(code.toUpperCase().trim());
  }

  /** Registra al usuario y guarda en localStorage */
  register(data: Omit<User, 'creadoEn' | 'role'>): void {
    const user: User = { ...data, creadoEn: new Date().toISOString(), role: 'USER' };
    this._user.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    
    // Guardar en la lista de usuarios registrados
    const users = this._loadAllUsers();
    // Reemplazar si ya existe el mismo código
    const index = users.findIndex(u => u.codigoActivacion === user.codigoActivacion);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  /** Iniciar sesión con los últimos 4 dígitos y contraseña o usuario admin */
  login(suffix: string, password: string): boolean {
    // Check hardcoded admins first
    const ADMINS: User[] = [
      {
        nombre: 'Super',
        apellido: 'Admin',
        fechaNacimiento: '1990-01-01',
        codigoActivacion: 'ROOT',
        password: 'admin',
        creadoEn: new Date().toISOString(),
        role: 'SUPER_ADMIN'
      },
      {
        nombre: 'Admin',
        apellido: 'El Farolito',
        fechaNacimiento: '1990-01-01',
        codigoActivacion: 'CEFA',
        password: 'cafe26',
        creadoEn: new Date().toISOString(),
        role: 'CAFE_ADMIN',
        cafeId: 'el-farolito'
      }
    ];

    const admin = ADMINS.find(a => a.codigoActivacion.toUpperCase() === suffix.toUpperCase() && a.password === password);
    if (admin) {
      this._user.set(admin);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
      return true;
    }

    // Normal user login
    const users = this._loadAllUsers();
    const user = users.find(u => 
      u.codigoActivacion.toUpperCase().endsWith(suffix.toUpperCase()) && 
      u.password === password && u.role === 'USER'
    );
    if (user) {
      this._user.set(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  /** Cierra sesión */
  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Actualiza el avatar */
  updateAvatar(avatar: UserAvatar): void {
    const current = this._user();
    if (!current) return;
    const updated = { ...current, avatar };
    this._user.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Actualizar en la lista de usuarios
    const users = this._loadAllUsers();
    const index = users.findIndex(u => u.codigoActivacion === updated.codigoActivacion);
    if (index !== -1) {
      users[index] = updated;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }

  private _loadUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      const defaultUser: User = {
        nombre: 'Pasajero',
        apellido: 'Café',
        fechaNacimiento: '1998-05-15',
        codigoActivacion: 'CAFE-2026-DEMO',
        creadoEn: '2026-01-01T00:00:00.000Z',
        role: 'USER',
        avatar: {
          icon: 'coffee',
          iconColor: '#FFFFFF',
          bgColor: '#1B2E24'
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return null;
    }
  }

  private _loadAllUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
