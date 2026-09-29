import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NetworkService } from './services/network.service';
import { DataService } from './services/data.service';
import { AuthService } from './services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex" [class.offline]="!network.isOnline()">

      <!-- ═══════════════════════════════
           SIDEBAR (lg+)
      ═══════════════════════════════ -->
      <aside class="hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 bg-white border-r border-gray-100 shadow-sm transition-all duration-300"
             [class.w-20]="sidebarCollapsed()"
             [class.w-64]="!sidebarCollapsed()">

        <!-- Brand -->
        <div class="flex items-center gap-3 px-5 py-5 border-b border-gray-100 min-h-[72px]"
             [class.justify-center]="sidebarCollapsed()"
             [class.px-3]="sidebarCollapsed()">
          <div class="w-10 h-10 bg-verde-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
              <line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>
            </svg>
          </div>
          @if (!sidebarCollapsed()) {
            <div class="overflow-hidden">
              <p class="text-sm font-bold text-verde-900 leading-tight whitespace-nowrap">Pasaporte del Café</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest whitespace-nowrap">Tecamachalco 2026</p>
            </div>
          }
        </div>

        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          @for (item of navItems(); track item.path) {
            <a [routerLink]="item.path"
               class="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group relative"
               [class.bg-verde-50]="isRouteActive(item.path, item.exact)"
               [class.text-verde-900]="isRouteActive(item.path, item.exact)"
               [class.text-gray-500]="!isRouteActive(item.path, item.exact)"
               [class.justify-center]="sidebarCollapsed()">
              @if (isRouteActive(item.path, item.exact)) {
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-verde-900 rounded-r-full"></div>
              }
              <lucide-icon [name]="item.lucide"
                   class="w-5 h-5 flex-shrink-0"
                   [class.text-verde-900]="isRouteActive(item.path, item.exact)"
                   [class.text-gray-400]="!isRouteActive(item.path, item.exact)">
              </lucide-icon>
              @if (!sidebarCollapsed()) {
                <span class="text-sm font-semibold whitespace-nowrap">{{ item.label }}</span>
              }
              @if (sidebarCollapsed()) {
                <div class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {{ item.label }}
                </div>
              }
            </a>
          }
        </nav>

        <!-- Avatar / Profile (sidebar bottom) -->
        @if (auth.isAuthenticated()) {
          <div class="px-2 pb-3 border-t border-gray-100 pt-3">
            <button (click)="auth.toggleProfile()"
                    class="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl hover:bg-gray-50 transition-all"
                    [class.justify-center]="sidebarCollapsed()">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                   [style.background-color]="auth.user()?.avatar?.bgColor">
                <lucide-icon [name]="auth.user()?.avatar?.icon || 'coffee'"
                             class="w-5 h-5"
                             [style.color]="auth.user()?.avatar?.iconColor">
                </lucide-icon>
              </div>
              @if (!sidebarCollapsed()) {
                <div class="flex-1 min-w-0 text-left">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ auth.user()?.nombre }} {{ auth.user()?.apellido }}</p>
                  <p class="text-[10px] text-gray-400 truncate">{{ data.totalSellos() }} sellos</p>
                </div>
                <lucide-icon name="chevron-up" class="w-4 h-4 text-gray-400 transition-transform"
                             [class.rotate-180]="auth.profileOpen()">
                </lucide-icon>
              }
            </button>
          </div>
        }

        <!-- Collapse Button -->
        <div class="px-2 py-4 border-t border-gray-100">
          <button (click)="sidebarCollapsed.set(!sidebarCollapsed())"
                  class="flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all text-sm font-medium"
                  [class.justify-center]="sidebarCollapsed()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 flex-shrink-0 transition-transform"
                 [class.rotate-180]="sidebarCollapsed()">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            @if (!sidebarCollapsed()) {
              <span>Colapsar menú</span>
            }
          </button>
          @if (!sidebarCollapsed()) {
            <div class="mt-3 flex items-center gap-2 px-3 py-2 rounded-2xl"
                 [class.bg-verde-50]="network.isOnline()"
                 [class.bg-yellow-50]="!network.isOnline()">
              <span class="w-2 h-2 rounded-full flex-shrink-0"
                    [class.bg-verde-500]="network.isOnline()"
                    [class.bg-yellow-500]="!network.isOnline()"
                    [class.animate-pulse]="!network.isOnline()">
              </span>
              <span class="text-xs font-medium"
                    [class.text-verde-700]="network.isOnline()"
                    [class.text-yellow-700]="!network.isOnline()">
                {{ network.isOnline() ? 'En línea' : 'Sin conexión' }}
              </span>
            </div>
          }
        </div>

      </aside>

      <!-- ═══════════════════════════════
           MAIN CONTENT AREA
      ═══════════════════════════════ -->
      <div class="flex-1 flex flex-col min-h-screen transition-all duration-300"
           [class.lg:ml-20]="sidebarCollapsed()"
           [class.lg:ml-64]="!sidebarCollapsed()">

        <!-- OFFLINE BANNER -->
        @if (!network.isOnline()) {
          <div class="w-full bg-yellow-500 text-yellow-900 text-xs font-semibold text-center py-1.5 px-4 flex items-center justify-center gap-1.5 sticky top-0 z-[100]">
            <lucide-icon name="alert-triangle" class="w-4 h-4"></lucide-icon>
            <span>Sin conexión — Mostrando contenido guardado</span>
          </div>
        }

        <!-- PAGE CONTENT -->
        <main class="flex-1 pb-20 lg:pb-0 relative">
          <router-outlet />
        </main>

      </div>

      <!-- ═══════════════════════════════
           BOTTOM NAVIGATION (mobile + tablet only)
      ═══════════════════════════════ -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-bottom-sheet"
           style="padding-bottom: env(safe-area-inset-bottom);">
        <div class="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
          @for (item of navItems(); track item.path) {
            <a [routerLink]="item.path"
               class="bottom-nav-item flex-1">
              <div class="w-9 h-9 flex items-center justify-center rounded-xl transition-all mx-auto"
                   [class.bg-verde-100]="isRouteActive(item.path, item.exact)">
                <lucide-icon [name]="item.lucide"
                     class="w-5 h-5"
                     [class.text-verde-900]="isRouteActive(item.path, item.exact)"
                     [class.text-gray-400]="!isRouteActive(item.path, item.exact)">
                </lucide-icon>
              </div>
              <span class="text-[10px] sm:text-xs font-medium leading-tight text-center"
                    [class.text-verde-900]="isRouteActive(item.path, item.exact)"
                    [class.text-gray-400]="!isRouteActive(item.path, item.exact)">
                {{ item.label }}
              </span>
            </a>
          }
        </div>
      </nav>

      <!-- ═══════════════════════════════
           PROFILE POPUP (bottom sheet / dropdown)
      ═══════════════════════════════ -->
      @if (auth.profileOpen() && auth.isAuthenticated()) {
        <!-- Backdrop -->
        <div class="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm" (click)="auth.profileOpen.set(false)"></div>

        <!-- Panel -->
        <div class="fixed z-[201] bottom-0 left-0 right-0 lg:bottom-auto lg:top-auto lg:left-auto
                    lg:right-6 lg:bottom-6
                    animate-slide-up">

          <!-- ID Card style -->
          <div class="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden max-w-sm lg:w-80 mx-auto">

            <!-- Card header / avatar area -->
            <div class="relative h-28 flex items-end px-5 pb-4"
                 [style.background]="'linear-gradient(135deg, ' + auth.user()?.avatar?.bgColor + ' 0%, ' + auth.user()?.avatar?.bgColor + 'CC 100%)'">
              <!-- Decorative pattern -->
              <div class="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="white"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dots)"/>
                </svg>
              </div>
              <div class="absolute top-4 right-5 text-right">
                <p class="text-white/70 text-[9px] font-bold uppercase tracking-widest">Pasaporte Digital</p>
                <p class="text-white/50 text-[9px]">Tecamachalco 2026</p>
              </div>
              <!-- Avatar -->
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30 flex-shrink-0"
                   [style.background-color]="auth.user()?.avatar?.bgColor + '99'">
                <lucide-icon [name]="auth.user()?.avatar?.icon || 'coffee'"
                             class="w-9 h-9"
                             [style.color]="auth.user()?.avatar?.iconColor">
                </lucide-icon>
              </div>
              <div class="ml-3">
                <p class="text-white font-bold text-lg leading-tight">{{ auth.user()?.nombre }} {{ auth.user()?.apellido }}</p>
                <p class="text-white/70 text-xs">{{ auth.user()?.codigoActivacion }}</p>
              </div>
            </div>

            <!-- Card body: stats -->
            <div class="px-5 py-4 grid grid-cols-3 gap-3 border-b border-gray-100">
              <div class="text-center">
                <p class="text-xl font-bold text-verde-900">{{ data.totalSellos() }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider">Sellos</p>
              </div>
              <div class="text-center border-x border-gray-100">
                <p class="text-xl font-bold text-verde-900">{{ data.progresoPorcentaje() }}%</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider">Progreso</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-cafe-700">{{ memberDays() }}</p>
                <p class="text-[10px] text-gray-500 uppercase tracking-wider">Días</p>
              </div>
            </div>

            <!-- Card footer: info + actions -->
            <div class="px-5 py-4 space-y-2">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <lucide-icon name="calendar" class="w-4 h-4 text-gray-400 flex-shrink-0"></lucide-icon>
                <span>Miembro desde {{ memberSince() }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <lucide-icon name="cake" class="w-4 h-4 text-gray-400 flex-shrink-0"></lucide-icon>
                <span>{{ memberBirthday() }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="px-5 pb-5 pt-1 space-y-2">
              @if (auth.user()?.role === 'SUPER_ADMIN' || auth.user()?.role === 'CAFE_ADMIN') {
                <a routerLink="/admin" (click)="auth.profileOpen.set(false)"
                   class="flex items-center justify-center gap-2 w-full bg-cafe-700 hover:bg-cafe-800 text-white font-semibold py-3 rounded-2xl text-sm transition-all mb-2">
                  <lucide-icon name="users" class="w-4 h-4"></lucide-icon>
                  Panel de Administración
                </a>
              } @else {
                <a routerLink="/pasaporte" (click)="auth.profileOpen.set(false)"
                   class="flex items-center justify-center gap-2 w-full bg-verde-900 hover:bg-verde-800 text-white font-semibold py-3 rounded-2xl text-sm transition-all mb-2">
                  <lucide-icon name="book" class="w-4 h-4"></lucide-icon>
                  Ver mi pasaporte
                </a>
              }
              <button (click)="logout()"
                      class="flex items-center justify-center gap-2 w-full border-2 border-red-100 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-2xl text-sm transition-all">
                <lucide-icon name="log-out" class="w-4 h-4"></lucide-icon>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 4px 2px;
      border-radius: 12px;
      transition: all 0.2s;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slideUp 0.25s ease-out;
    }
  `],
})
export class AppComponent {
  data = inject(DataService);
  auth = inject(AuthService);
  private router = inject(Router);
  currentUrl = signal<string>(typeof window !== 'undefined' ? window.location.pathname : '/');

  constructor(public network: NetworkService) {
    // Update immediately on navigation start (for instant highlight feedback)
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart || event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = (event.url || event.urlAfterRedirects || '').split('?')[0].split('#')[0] || '/';
      this.currentUrl.set(url);
    });
  }

  sidebarCollapsed = signal(false);

  isRouteActive(path: string, exact: boolean = false): boolean {
    const url = this.currentUrl().split('?')[0].split('#')[0];
    if (exact || path === '/') {
      return url === path;
    }
    return url === path || url.startsWith(path + '/');
  }

  navItems = computed(() => {
    const items = [
      { path: '/', exact: true, label: 'Inicio', lucide: 'home' },
      { path: '/mapa', exact: false, label: 'Mapa', lucide: 'map' },
    ];

    const user = this.auth.user();
    if (user) {
      items.push({ path: '/pasaporte', exact: false, label: 'Mi Pasaporte', lucide: 'book' });
      if (user.role === 'SUPER_ADMIN' || user.role === 'CAFE_ADMIN') {
        items.push({ path: '/admin', exact: false, label: 'Panel Admin', lucide: 'users' });
      }
    }

    items.push({ path: '/activar', exact: false, label: user ? 'Nuevo Sello' : 'Activar', lucide: 'qr-code' });
    return items;
  });

  logout(): void {
    this.auth.logout();
    this.auth.profileOpen.set(false);
  }

  memberDays = computed(() => {
    const user = this.auth.user();
    if (!user?.creadoEn) return 1;
    const time = new Date(user.creadoEn).getTime();
    if (isNaN(time)) return 1;
    const diff = Date.now() - time;
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  });

  memberSince = computed(() => {
    const user = this.auth.user();
    if (!user?.creadoEn) return '1 de enero de 2026';
    try {
      const d = new Date(user.creadoEn);
      return isNaN(d.getTime()) ? '1 de enero de 2026' : d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '1 de enero de 2026';
    }
  });

  memberBirthday = computed(() => {
    const user = this.auth.user();
    if (!user?.fechaNacimiento) return '';
    try {
      const dateStr = user.fechaNacimiento.includes('T') ? user.fechaNacimiento : `${user.fechaNacimiento}T00:00:00`;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? user.fechaNacimiento : d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return user.fechaNacimiento;
    }
  });
}
