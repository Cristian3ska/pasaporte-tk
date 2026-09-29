import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 pb-20">
      <!-- Admin Header -->
      <header class="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">
            {{ isSuperAdmin() ? 'Panel de Administración' : 'Panel de Cafetería' }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ isSuperAdmin() ? 'Control total' : cafe()?.nombre }}
          </p>
        </div>
        <button (click)="logout()" class="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors">
          <lucide-icon name="log-out" class="w-5 h-5"></lucide-icon>
        </button>
      </header>

      <div class="max-w-4xl mx-auto p-6 space-y-6">
        
        <!-- ======================= 
             SUPER ADMIN VIEW 
             ======================= -->
        @if (isSuperAdmin()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Global Stats -->
            <div class="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-verde-100 rounded-xl flex items-center justify-center text-verde-900">
                  <lucide-icon name="user-round" class="w-5 h-5"></lucide-icon>
                </div>
                <p class="font-bold text-gray-900">Usuarios Registrados</p>
              </div>
              <p class="text-3xl font-black text-verde-900">124</p>
              <p class="text-xs text-gray-500 mt-1">+12 esta semana</p>
            </div>

            <div class="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-cafe-100 rounded-xl flex items-center justify-center text-cafe-700">
                  <lucide-icon name="coffee" class="w-5 h-5"></lucide-icon>
                </div>
                <p class="font-bold text-gray-900">Cafeterías Activas</p>
              </div>
              <p class="text-3xl font-black text-cafe-900">{{ data.totalCafeterias() }}</p>
              <p class="text-xs text-gray-500 mt-1">En la ruta oficial</p>
            </div>

            <div class="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                  <lucide-icon name="zap" class="w-5 h-5"></lucide-icon>
                </div>
                <p class="font-bold text-gray-900">Total Sellos Emitidos</p>
              </div>
              <p class="text-3xl font-black text-amber-900">892</p>
              <p class="text-xs text-gray-500 mt-1">En todas las cafeterías</p>
            </div>
          </div>

          <!-- Cafeterias CRUD Mock -->
          <div class="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Directorio de Cafeterías</h2>
              <button class="bg-verde-900 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-verde-800 transition-colors">
                <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Añadir nueva
              </button>
            </div>
            
            <div class="space-y-3">
              @for (c of data.cafeterias(); track c.id) {
                <div class="flex items-center justify-between p-3 border border-gray-100 rounded-2xl">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" [style.background-color]="c.color">
                      <lucide-icon name="coffee" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-bold text-sm text-gray-900">{{ c.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ c.abierto ? 'Abierto ahora' : 'Cerrado' }}</p>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button (click)="selectedQrCafe.set(c)" class="bg-verde-50 text-verde-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-verde-100 transition-colors flex items-center gap-1">
                      <lucide-icon name="qr-code" class="w-4 h-4"></lucide-icon> Generar QR
                    </button>
                    <button class="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><lucide-icon name="pen-line" class="w-4 h-4"></lucide-icon></button>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <!-- Debug Actions -->
          <div class="bg-red-50 rounded-3xl p-6 border border-red-100 mt-6">
            <h2 class="text-red-900 font-bold mb-2">Peligro: Modo Pruebas</h2>
            <p class="text-red-700 text-xs mb-4">Usa estos botones solo si estás haciendo pruebas. La primera opción borra solo tus sellos, la segunda borra toda la base de datos (cuentas y usuarios).</p>
            
            <div class="space-y-3">
              <button (click)="limpiarDatosPersonales()" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <lucide-icon name="eraser" class="w-4 h-4"></lucide-icon>
                Limpiar solo mis sellos y catas
              </button>
              <button (click)="factoryReset()" class="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <lucide-icon name="skull" class="w-4 h-4"></lucide-icon>
                Borrar TODA la aplicación (Factory Reset)
              </button>
            </div>
            
            @if (datosLimpiados) {
              <p class="text-green-600 font-bold text-center text-sm mt-3 flex items-center justify-center gap-1">
                <lucide-icon name="check" class="w-4 h-4"></lucide-icon> ¡Datos limpiados correctamente!
              </p>
            }
          </div>
        }

        <!-- ======================= 
             CAFE ADMIN VIEW 
             ======================= -->
        @if (isCafeAdmin() && cafe()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- CAFE Stats -->
            <div class="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-verde-100 rounded-xl flex items-center justify-center text-verde-900">
                  <lucide-icon name="users" class="w-5 h-5"></lucide-icon>
                </div>
                <p class="font-bold text-gray-900">Visitantes Hoy</p>
              </div>
              <p class="text-3xl font-black text-verde-900">34</p>
              <p class="text-xs text-gray-500 mt-1">12 nuevos / 22 recurrentes</p>
            </div>

            <div class="bg-white rounded-3xl p-5 shadow-card border border-gray-100">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700">
                  <lucide-icon name="zap" class="w-5 h-5"></lucide-icon>
                </div>
                <p class="font-bold text-gray-900">Sellos Emitidos</p>
              </div>
              <p class="text-3xl font-black text-amber-900">34</p>
              <p class="text-xs text-gray-500 mt-1">100% de los visitantes</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Emit Manual Stamp -->
            <div class="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
              <h2 class="text-lg font-bold text-gray-900 mb-1">Emitir Sello Manual</h2>
              <p class="text-xs text-gray-500 mb-4">Ingresa el código del usuario si no puede escanear el QR.</p>
              <div class="flex gap-2">
                <input type="text" placeholder="Últimos 4 dígitos (ej. DEMO)" [(ngModel)]="manualUserCode" class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-mono uppercase focus:border-verde-500 focus:ring-2 focus:ring-verde-100 outline-none">
                <button (click)="emitManualStamp()" class="bg-verde-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-verde-800 transition-colors">Emitir</button>
              </div>
              @if (manualStampSuccess) {
                <p class="text-xs text-green-600 mt-2 flex items-center gap-1"><lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon> ¡Sello emitido con éxito!</p>
              }
            </div>

            <!-- Cafe Status -->
            <div class="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
              <h2 class="text-lg font-bold text-gray-900 mb-1">Estado del local</h2>
              <p class="text-xs text-gray-500 mb-4">Actualiza tu visibilidad en el mapa de los usuarios.</p>
              
              <div class="flex items-center justify-between p-4 rounded-2xl border-2 transition-colors cursor-pointer"
                   [class.border-verde-500]="cafeAbierto"
                   [class.bg-verde-50]="cafeAbierto"
                   [class.border-gray-200]="!cafeAbierto"
                   (click)="toggleCafeStatus()">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full" [class.bg-verde-500]="cafeAbierto" [class.bg-gray-300]="!cafeAbierto"></div>
                  <span class="font-bold text-sm" [class.text-verde-900]="cafeAbierto" [class.text-gray-500]="!cafeAbierto">
                    {{ cafeAbierto ? 'Abierto' : 'Cerrado' }}
                  </span>
                </div>
                <lucide-icon [name]="cafeAbierto ? 'power' : 'power-off'" class="w-5 h-5" [class.text-verde-700]="cafeAbierto" [class.text-gray-400]="!cafeAbierto"></lucide-icon>
              </div>
            </div>
          </div>
        }

      </div>

      <!-- QR Modal -->
      @if (selectedQrCafe()) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full relative animate-fade-in text-center">
            <button (click)="selectedQrCafe.set(null)" class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
              <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
            </button>
            <h2 class="text-xl font-bold text-gray-900 mb-1">QR de Sellado</h2>
            <p class="text-sm text-gray-500 mb-6">{{ selectedQrCafe()?.nombre }}</p>
            
            <div class="bg-gray-50 p-4 rounded-3xl inline-block mb-4 shadow-inner">
              <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + selectedQrCafe()?.id" 
                   alt="QR Code" class="w-48 h-48 rounded-xl shadow-sm">
            </div>
            
            <div class="bg-verde-50 text-verde-900 px-4 py-3 rounded-2xl text-xs font-medium text-left">
              <strong>Instrucciones:</strong> Muestra este código a los clientes para que lo escaneen desde la sección "Nuevo Sello" de su pasaporte y obtengan el sello de tu cafetería.
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent {
  auth = inject(AuthService);
  data = inject(DataService);
  router = inject(Router);

  manualUserCode = '';
  manualStampSuccess = false;
  cafeAbierto = true; // In a real app this would sync with DataService
  
  selectedQrCafe = signal<any>(null);
  datosLimpiados = false;

  isSuperAdmin(): boolean {
    return this.auth.user()?.role === 'SUPER_ADMIN';
  }

  isCafeAdmin(): boolean {
    return this.auth.user()?.role === 'CAFE_ADMIN';
  }

  cafe() {
    const cafeId = this.auth.user()?.cafeId;
    if (!cafeId) return null;
    return this.data.getCafeteria(cafeId);
  }

  emitManualStamp(): void {
    if (this.manualUserCode.length > 0) {
      this.manualStampSuccess = true;
      setTimeout(() => this.manualStampSuccess = false, 3000);
      this.manualUserCode = '';
    }
  }

  toggleCafeStatus(): void {
    this.cafeAbierto = !this.cafeAbierto;
  }

  limpiarDatosPersonales(): void {
    this.data.limpiarRegistros();
    this.datosLimpiados = true;
    setTimeout(() => this.datosLimpiados = false, 3000);
  }

  factoryReset(): void {
    if (confirm('¿Estás SEGURO de que quieres borrar todos los usuarios, sellos y configuraciones de este dispositivo? Esta acción te desconectará.')) {
      this.data.factoryReset();
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
