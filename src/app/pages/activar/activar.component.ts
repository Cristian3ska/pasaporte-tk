import { Component, inject, signal, AfterViewInit, OnDestroy, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService, UserAvatar, CODIGOS_VALIDOS } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

// Iconos de café disponibles para el avatar
const AVATAR_ICONS = [
  { name: 'coffee', label: 'Café' },
  { name: 'cup-soda', label: 'Bebida' },
  { name: 'bean', label: 'Grano' },
  { name: 'flask-conical', label: 'Extracción' },
  { name: 'droplets', label: 'Notas' },
  { name: 'leaf', label: 'Origen' },
  { name: 'flame', label: 'Tueste' },
  { name: 'star', label: 'Favorito' },
];

const AVATAR_COLORS = [
  { bg: '#1B2E24', label: 'Etiopía' },
  { bg: '#6D4C41', label: 'Tostado' },
  { bg: '#2E7D32', label: 'Terruño' },
  { bg: '#1565C0', label: 'Cielo' },
  { bg: '#6A1B9A', label: 'Lavanda' },
  { bg: '#BF360C', label: 'Cereza' },
  { bg: '#F57F17', label: 'Miel' },
  { bg: '#37474F', label: 'Pizarra' },
];

const ICON_COLORS = [
  '#FFFFFF', '#F5F1EA', '#FFD54F', '#A5D6A7',
  '#90CAF9', '#CE93D8', '#FFAB91', '#B0BEC5',
];

type Step = 'scan' | 'code' | 'register' | 'avatar' | 'success' | 'login';

@Component({
  selector: 'app-activar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  template: `
    <div class="animate-fade-in min-h-screen bg-gray-50">

      <!-- PAGE HEADER -->
      <header class="bg-white px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div class="flex items-center gap-2.5 lg:hidden">
          <div class="w-9 h-9 bg-verde-900 rounded-xl flex items-center justify-center shadow-sm" [class.bg-cafe-700]="auth.isAuthenticated()">
            <lucide-icon [name]="auth.isAuthenticated() ? 'coffee' : 'qr-code'" class="w-5 h-5 text-white"></lucide-icon>
          </div>
          <div>
            <p class="text-xs font-semibold text-verde-900 tracking-wider uppercase leading-none" [class.text-cafe-900]="auth.isAuthenticated()">Pasaporte Café</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest">{{ auth.isAuthenticated() ? 'Añadir Sello' : 'Activar' }}</p>
          </div>
        </div>
        <div class="hidden lg:block">
          @if (auth.isAuthenticated()) {
            <h1 class="text-xl font-bold text-gray-900">Añadir Sello</h1>
            <p class="text-sm text-gray-500">Escanea el código QR de la cafetería para desbloquearla y añadir tus notas</p>
          } @else {
            <h1 class="text-xl font-bold text-gray-900">Activar Pasaporte</h1>
            <p class="text-sm text-gray-500">Ingresa el código de tu pasaporte físico para comenzar</p>
          }
        </div>
        <button class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
          <lucide-icon name="circle-help" class="w-5 h-5 text-gray-600"></lucide-icon>
        </button>
      </header>

      <!-- ═══════════════════════════════════════════
           SI ESTÁ AUTENTICADO → vista escáner sencilla
      ═══════════════════════════════════════════ -->
      @if (auth.isAuthenticated()) {
        <div class="px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6
                    grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_400px] gap-6 max-w-screen-xl mx-auto pb-24 lg:pb-10">

          <!-- SCANNER COLUMN -->
          <div class="space-y-5">
            <div class="bg-white rounded-3xl shadow-card p-1.5 flex">
              <button (click)="mode.set('qr')"
                      class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-2xl transition-all"
                      [class.bg-verde-900]="mode() === 'qr'"
                      [class.text-white]="mode() === 'qr'"
                      [class.text-gray-500]="mode() !== 'qr'">
                <lucide-icon name="qr-code" class="w-4 h-4"></lucide-icon>
                Escanear QR
              </button>
              <button (click)="mode.set('manual')"
                      class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-2xl transition-all"
                      [class.bg-cafe-700]="mode() === 'manual'"
                      [class.text-white]="mode() === 'manual'"
                      [class.text-gray-500]="mode() !== 'manual'">
                <lucide-icon name="pen-line" class="w-4 h-4"></lucide-icon>
                Código manual
              </button>
            </div>

            @if (mode() === 'qr') {
              <div class="bg-white rounded-3xl shadow-card overflow-hidden animate-fade-in">
                <div class="p-5 border-b border-gray-100">
                  <h2 class="text-base font-bold text-gray-900">Escanear código QR</h2>
                  <p class="text-sm text-gray-500 mt-0.5">Apunta la cámara al código QR de la cafetería</p>
                </div>

                @if (!scanResult()) {
                  <div class="relative bg-gray-900" style="height: 320px;">
                    <div id="qr-reader" class="w-full h-full"></div>
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div class="relative" style="width: 220px; height: 220px;">
                        <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-verde-400 rounded-tl-xl"></div>
                        <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-verde-400 rounded-tr-xl"></div>
                        <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-verde-400 rounded-bl-xl"></div>
                        <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-verde-400 rounded-br-xl"></div>
                        <div class="absolute left-3 right-3 h-0.5 bg-verde-400 opacity-80 scan-line"></div>
                      </div>
                    </div>
                    @if (!scannerStarted()) {
                      <div class="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-4">
                        <div class="w-16 h-16 bg-verde-900 rounded-2xl flex items-center justify-center">
                          <lucide-icon name="qr-code" class="w-8 h-8 text-white"></lucide-icon>
                        </div>
                        <p class="text-white text-sm">Toca para activar la cámara</p>
                        <button (click)="startScanner()" class="bg-verde-900 hover:bg-verde-800 text-white px-6 py-3 rounded-2xl font-semibold text-sm transition-all">
                          Activar cámara
                        </button>
                      </div>
                    }
                  </div>
                  @if (scannerStarted()) {
                    <div class="p-4">
                      <button (click)="stopScanner()" class="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-all">
                        <lucide-icon name="square" class="w-4 h-4"></lucide-icon>
                        Detener escáner
                      </button>
                    </div>
                  }
                }

                @if (scanResult()) {
                  <div class="p-6 text-center animate-fade-in">
                    <div class="w-16 h-16 bg-verde-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <lucide-icon name="check-circle" class="w-8 h-8 text-white"></lucide-icon>
                    </div>
                    <h3 class="text-xl font-bold text-verde-900 mb-1">¡Sello obtenido!</h3>
                    <p class="text-verde-700 text-sm mb-5">{{ scanResult() }}</p>
                    
                    <!-- Formulario Rápido de Cata -->
                    @if (!notaGuardada()) {
                      <div class="bg-gray-50 rounded-2xl p-4 text-left mb-5">
                        <p class="text-sm font-bold text-gray-900 mb-2">Añadir al Diario de Catas</p>
                        <textarea [(ngModel)]="notaCata" rows="2" placeholder="¿Qué te pareció esta cafetería?"
                                  class="w-full p-3 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-verde-300 resize-none mb-3">
                        </textarea>
                        <div class="flex items-center justify-between">
                          <div class="flex gap-1.5">
                            @for (star of [1,2,3,4,5]; track star) {
                              <button (click)="calificacionCata = star" class="transition-all" [class.opacity-40]="star > calificacionCata">
                                <lucide-icon name="star" class="w-5 h-5 text-yellow-500" [class.fill-current]="star <= calificacionCata"></lucide-icon>
                              </button>
                            }
                          </div>
                          <button (click)="guardarNotaRapida()" class="bg-verde-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-verde-800 transition-all">
                            Guardar nota
                          </button>
                        </div>
                      </div>
                    } @else {
                      <div class="bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-2xl p-3 mb-5 flex items-center justify-center gap-2">
                        <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
                        Nota guardada en tu diario
                      </div>
                    }

                    <div class="flex gap-3">
                      <button (click)="resetScanner()" class="flex-1 py-3 rounded-2xl border-2 border-verde-900 text-verde-900 font-semibold text-sm hover:bg-verde-50 transition-all">Escanear otro</button>
                      <a routerLink="/pasaporte" class="flex-1 flex items-center justify-center py-3 rounded-2xl bg-verde-900 text-white font-semibold text-sm hover:bg-verde-800 transition-all">Ver pasaporte</a>
                    </div>
                  </div>
                }
              </div>
            }

            @if (mode() === 'manual') {
              <div class="bg-white rounded-3xl shadow-card p-5 animate-fade-in">
                <h2 class="text-base font-bold text-gray-900 mb-1">Código de cafetería</h2>
                <p class="text-sm text-gray-500 mb-4">Ingresa el código de sellado de la cafetería</p>
                <div class="mb-4 bg-verde-50 border border-verde-100 rounded-xl p-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="sparkles" class="w-4 h-4 text-verde-600"></lucide-icon>
                    <span class="text-xs text-verde-800">Código de prueba: <strong class="font-mono tracking-wider">CAFE-2026-DEMO</strong></span>
                  </div>
                  <button (click)="manualCode = 'CAFE-2026-DEMO'" class="text-[10px] font-bold uppercase bg-verde-200 text-verde-800 px-2 py-1 rounded-lg hover:bg-verde-300 transition-colors">Usar</button>
                </div>
                <input type="text" placeholder="ej. CAFE-2026-XXXX"
                       class="w-full p-4 border-2 border-gray-200 rounded-2xl text-center text-lg font-mono font-bold tracking-widest outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-200 uppercase mb-4"
                       [(ngModel)]="manualCode" (input)="onCodeInput($event)">
                <div class="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  @for (cafe of data.cafeterias(); track cafe.id) {
                    <button (click)="selectedCafeId.set(cafe.id)"
                            class="w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left"
                            [class.border-verde-500]="selectedCafeId() === cafe.id"
                            [class.bg-verde-50]="selectedCafeId() === cafe.id"
                            [class.border-gray-200]="selectedCafeId() !== cafe.id">
                      <div class="w-9 h-9 rounded-xl flex items-center justify-center" [style.background-color]="cafe.color">
                        <lucide-icon name="coffee" class="w-4 h-4 text-white"></lucide-icon>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-sm text-gray-900 truncate">{{ cafe.nombre }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ cafe.distancia }}</p>
                      </div>
                      @if (selectedCafeId() === cafe.id) {
                        <lucide-icon name="check-circle" class="w-5 h-5 text-verde-600 flex-shrink-0"></lucide-icon>
                      }
                    </button>
                  }
                </div>
                <button (click)="activateManual()"
                        class="flex items-center justify-center gap-2 w-full bg-verde-900 hover:bg-verde-800 text-white font-semibold py-4 rounded-2xl text-sm transition-all"
                        [disabled]="!selectedCafeId()"
                        [class.opacity-50]="!selectedCafeId()">
                  <lucide-icon name="zap" class="w-4 h-4"></lucide-icon>
                  Activar sello
                </button>
              </div>
            }
          </div>

          <!-- RIGHT COLUMN -->
          <div class="space-y-5">
            <div class="bg-white rounded-3xl shadow-card p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 bg-cafe-100 rounded-xl flex items-center justify-center text-cafe-700">
                  <lucide-icon name="book-open" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <p class="font-bold text-gray-900">¿Cómo funciona?</p>
                  <p class="text-xs text-gray-500">Obtén tus sellos en cada cafetería</p>
                </div>
              </div>
              <ol class="space-y-3">
                @for (step of howItWorks; track step.num) {
                  <li class="flex items-start gap-3">
                    <span class="w-7 h-7 bg-verde-100 text-verde-900 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{{ step.num }}</span>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ step.texto }}</p>
                  </li>
                }
              </ol>
            </div>
            <div class="bg-verde-900 rounded-3xl p-5 text-center">
              <p class="text-white font-bold text-2xl mb-1">{{ data.totalSellos() }} / 15</p>
              <p class="text-verde-300 text-sm">sellos coleccionados</p>
              <div class="mt-3 bg-verde-800 rounded-full h-2.5">
                <div class="bg-gradient-to-r from-green-300 to-yellow-300 h-2.5 rounded-full transition-all"
                     [style.width.%]="data.progresoPorcentaje()"></div>
              </div>
              <a routerLink="/pasaporte" class="inline-flex items-center gap-2 mt-3 text-green-300 text-xs font-semibold hover:text-white transition-colors">
                Ver mi pasaporte →
              </a>
            </div>
          </div>
        </div>
      }

      <!-- ═══════════════════════════════════════════
           SI NO ESTÁ AUTENTICADO → Flujo de activación
      ═══════════════════════════════════════════ -->
      @if (!auth.isAuthenticated()) {
        <div class="max-w-md mx-auto px-4 py-8 pb-24 lg:pb-10">

          <!-- Paso indicador -->
          <div class="flex items-center justify-center gap-2 mb-8">
            @for (s of ['code','register','avatar']; track s) {
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                     [class.bg-verde-900]="isStepDone(s) || activationStep() === s"
                     [class.text-white]="isStepDone(s) || activationStep() === s"
                     [class.bg-gray-200]="!isStepDone(s) && activationStep() !== s"
                     [class.text-gray-400]="!isStepDone(s) && activationStep() !== s">
                  @if (isStepDone(s)) {
                    <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
                  } @else {
                    {{ $index + 1 }}
                  }
                </div>
                @if ($index < 2) {
                  <div class="w-8 h-0.5 transition-all"
                       [class.bg-verde-900]="isStepDone(s)"
                       [class.bg-gray-200]="!isStepDone(s)"></div>
                }
              </div>
            }
          </div>

          <!-- PASO 1: Ingresar código -->
          @if (activationStep() === 'code') {
            <div class="bg-white rounded-3xl shadow-card p-6 animate-fade-in">
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-verde-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <lucide-icon name="qr-code" class="w-8 h-8 text-white"></lucide-icon>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Activa tu pasaporte</h2>
                <p class="text-sm text-gray-500 mt-1">Ingresa el código impreso en tu pasaporte físico</p>
              </div>

              <!-- Hint code -->
              <div class="mb-4 bg-verde-50 border border-verde-100 rounded-xl p-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <lucide-icon name="sparkles" class="w-4 h-4 text-verde-600"></lucide-icon>
                  <span class="text-xs text-verde-800">Código de prueba: <strong class="font-mono tracking-wider">CAFE-2026-DEMO</strong></span>
                </div>
                <button (click)="activationCode = 'CAFE-2026-DEMO'" class="text-[10px] font-bold uppercase bg-verde-200 text-verde-800 px-2 py-1 rounded-lg hover:bg-verde-300 transition-colors">Usar</button>
              </div>

              <input type="text"
                     placeholder="ej. CAFE-2026-XXXX"
                     class="w-full p-4 border-2 rounded-2xl text-center text-lg font-mono font-bold tracking-widest outline-none uppercase transition-colors mb-2"
                     [class.border-gray-200]="!codeError()"
                     [class.border-red-300]="codeError()"
                     [class.focus:border-verde-500]="!codeError()"
                     [(ngModel)]="activationCode"
                     (input)="activationCode = $any($event.target).value.toUpperCase(); codeError.set(false)">
              @if (codeError()) {
                <p class="text-red-500 text-xs text-center mb-2">
                  <lucide-icon name="alert-triangle" class="w-3 h-3 inline mr-1"></lucide-icon>
                  Código inválido. Verifica el código en tu pasaporte físico.
                </p>
              }

              <button (click)="validateActivationCode()"
                      class="w-full bg-verde-900 hover:bg-verde-800 text-white font-semibold py-4 rounded-2xl text-sm transition-all mt-4 flex items-center justify-center gap-2">
                <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
                Validar código
              </button>

              <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">¿Ya tienes un pasaporte?</p>
                <button (click)="activationStep.set('login')" class="text-verde-700 font-semibold hover:underline text-sm mt-1">Inicia sesión aquí</button>
              </div>
            </div>
          }

          <!-- PASO LOGIN: Iniciar sesión -->
          @if (activationStep() === 'login') {
            <div class="bg-white rounded-3xl shadow-card p-6 animate-fade-in">
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-cafe-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <lucide-icon name="user-round" class="w-8 h-8 text-white"></lucide-icon>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Iniciar sesión</h2>
                <p class="text-sm text-gray-500 mt-1">Ingresa los últimos 4 dígitos de tu código impreso en tu pasaporte y tu contraseña</p>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Últimos 4 dígitos del código (ej. 1234)</label>
                  <input type="text" placeholder="DEMO"
                         maxlength="4"
                         class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-center text-lg font-mono font-bold tracking-widest outline-none focus:border-cafe-500 focus:ring-2 focus:ring-cafe-100 uppercase transition-colors"
                         [(ngModel)]="loginSuffix">
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Contraseña</label>
                  <div class="relative">
                    <input [type]="showPassword() ? 'text' : 'password'"
                           placeholder="Tu contraseña"
                           class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-cafe-500 focus:ring-2 focus:ring-cafe-100 transition-colors pr-12"
                           [(ngModel)]="loginPassword">
                    <button type="button" (click)="showPassword.set(!showPassword())"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" class="w-5 h-5"></lucide-icon>
                    </button>
                  </div>
                </div>

                @if (loginError()) {
                  <p class="text-red-500 text-xs text-center">
                    <lucide-icon name="alert-triangle" class="w-3 h-3 inline mr-1"></lucide-icon>
                    {{ loginError() }}
                  </p>
                }

                <button (click)="doLogin()"
                        class="w-full bg-cafe-700 hover:bg-cafe-800 text-white font-semibold py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
                  <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
                  Entrar
                </button>
              </div>

              <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">¿No has activado tu pasaporte?</p>
                <button (click)="activationStep.set('code')" class="text-cafe-700 font-semibold hover:underline text-sm mt-1">Actívalo aquí</button>
              </div>
            </div>
          }

          <!-- PASO 2: Datos personales -->
          @if (activationStep() === 'register') {
            <div class="bg-white rounded-3xl shadow-card p-6 animate-fade-in">
              <div class="text-center mb-6">
                <div class="w-16 h-16 bg-cafe-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <lucide-icon name="user-round" class="w-8 h-8 text-white"></lucide-icon>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Completa tu perfil</h2>
                <p class="text-sm text-gray-500 mt-1">Necesitamos algunos datos para crear tu pasaporte</p>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs font-semibold text-gray-600 mb-1 block">Nombre</label>
                    <input type="text" placeholder="María"
                           class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-100 transition-colors"
                           [(ngModel)]="regNombre">
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-gray-600 mb-1 block">Apellido</label>
                    <input type="text" placeholder="García"
                           class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-100 transition-colors"
                           [(ngModel)]="regApellido">
                  </div>
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Fecha de nacimiento</label>
                  <input type="date"
                         class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-100 transition-colors"
                         [(ngModel)]="regFechaNacimiento">
                </div>

                <div>
                  <label class="text-xs font-semibold text-gray-600 mb-1 block">Contraseña</label>
                  <div class="relative">
                    <input [type]="showPassword() ? 'text' : 'password'"
                           placeholder="Mínimo 6 caracteres"
                           class="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-verde-500 focus:ring-2 focus:ring-verde-100 transition-colors pr-12"
                           [(ngModel)]="regPassword">
                    <button type="button" (click)="showPassword.set(!showPassword())"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" class="w-5 h-5"></lucide-icon>
                    </button>
                  </div>
                </div>

                @if (regError()) {
                  <p class="text-red-500 text-xs text-center">
                    <lucide-icon name="alert-triangle" class="w-3 h-3 inline mr-1"></lucide-icon>
                    {{ regError() }}
                  </p>
                }

                <button (click)="goToAvatar()"
                        class="w-full bg-verde-900 hover:bg-verde-800 text-white font-semibold py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
                  <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
                  Continuar
                </button>
              </div>
            </div>
          }

          <!-- PASO 3: Personalizar avatar -->
          @if (activationStep() === 'avatar') {
            <div class="bg-white rounded-3xl shadow-card p-6 animate-fade-in">
              <div class="text-center mb-6">
                <h2 class="text-xl font-bold text-gray-900">Personaliza tu avatar</h2>
                <p class="text-sm text-gray-500 mt-1">Elige un ícono y colores que te representen</p>
              </div>

              <!-- Preview del avatar -->
              <div class="flex justify-center mb-6">
                <div class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-all"
                     [style.background-color]="selectedBgColor()">
                  <lucide-icon [name]="selectedIcon()" class="w-10 h-10" [style.color]="selectedIconColor()"></lucide-icon>
                </div>
              </div>

              <!-- Elegir ícono -->
              <div class="mb-5">
                <p class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Ícono</p>
                <div class="grid grid-cols-4 gap-2">
                  @for (ic of avatarIcons; track ic.name) {
                    <button (click)="selectedIcon.set(ic.name)"
                            class="flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all"
                            [class.border-verde-500]="selectedIcon() === ic.name"
                            [class.bg-verde-50]="selectedIcon() === ic.name"
                            [class.border-gray-200]="selectedIcon() !== ic.name">
                      <lucide-icon [name]="ic.name" class="w-5 h-5 text-gray-700"></lucide-icon>
                      <span class="text-[10px] text-gray-500">{{ ic.label }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Color de fondo -->
              <div class="mb-5">
                <p class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Fondo</p>
                <div class="flex flex-wrap gap-2">
                  @for (c of avatarBgColors; track c.bg) {
                    <button (click)="selectedBgColor.set(c.bg)"
                            class="w-9 h-9 rounded-xl border-4 transition-all flex-shrink-0"
                            [style.background-color]="c.bg"
                            [class.border-gray-900]="selectedBgColor() === c.bg"
                            [class.border-transparent]="selectedBgColor() !== c.bg"
                            [title]="c.label">
                    </button>
                  }
                </div>
              </div>

              <!-- Color del ícono -->
              <div class="mb-6">
                <p class="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Color del ícono</p>
                <div class="flex flex-wrap gap-2">
                  @for (c of iconColors; track c) {
                    <button (click)="selectedIconColor.set(c)"
                            class="w-9 h-9 rounded-xl border-4 transition-all flex-shrink-0"
                            [style.background-color]="c"
                            [class.border-gray-900]="selectedIconColor() === c"
                            [class.border-gray-200]="selectedIconColor() !== c">
                    </button>
                  }
                </div>
              </div>

              <button (click)="completeRegistration()"
                      class="w-full bg-verde-900 hover:bg-verde-800 text-white font-semibold py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2">
                <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon>
                Crear mi pasaporte
              </button>
            </div>
          }

          <!-- ÉXITO -->
          @if (activationStep() === 'success') {
            <div class="bg-white rounded-3xl shadow-card p-8 text-center animate-fade-in">
              <div class="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl transition-all"
                   [style.background-color]="auth.user()?.avatar?.bgColor">
                <lucide-icon [name]="auth.user()?.avatar?.icon || 'coffee'" class="w-12 h-12"
                             [style.color]="auth.user()?.avatar?.iconColor"></lucide-icon>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-1">¡Bienvenido, {{ auth.user()?.nombre }}!</h2>
              <p class="text-gray-500 text-sm mb-6">Tu pasaporte está activado y listo para usarse.</p>
              <div class="space-y-3">
                <a routerLink="/pasaporte"
                   class="flex items-center justify-center gap-2 w-full bg-verde-900 hover:bg-verde-800 text-white font-semibold py-4 rounded-2xl text-sm transition-all">
                  <lucide-icon name="book" class="w-4 h-4"></lucide-icon>
                  Ver mi pasaporte
                </a>
                <a routerLink="/"
                   class="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl text-sm hover:bg-gray-50 transition-all">
                  Ir al inicio
                </a>
              </div>
            </div>
          }

        </div>
      }

    </div>

    <style>
      .scan-line {
        top: 50%;
        animation: scanLine 2s linear infinite;
      }
      @keyframes scanLine {
        0%   { top: 10%; }
        50%  { top: 90%; }
        100% { top: 10%; }
      }
    </style>
  `,
})
export class ActivarComponent implements AfterViewInit, OnDestroy {
  data = inject(DataService);
  auth = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // ── Scanner (para usuarios autenticados) ──────────────────
  mode = signal<'qr' | 'manual'>('qr');
  scanResult = signal<string | null>(null);
  scannerStarted = signal(false);
  selectedCafeId = signal<string | null>(null);
  manualCode = '';
  private html5QrCode: any;

  // ── Diario Rápido ───────────────────────────────────────────
  scannedCafeInfo: any = null;
  notaCata = '';
  calificacionCata = 5;
  notaGuardada = signal(false);

  // ── Activation flow (para nuevos usuarios) ────────────────
  activationStep = signal<'code' | 'register' | 'avatar' | 'success' | 'login'>('code');
  activationCode = '';
  codeError = signal(false);

  // Step: register
  regNombre = '';
  regApellido = '';
  regFechaNacimiento = '';
  regPassword = '';
  showPassword = signal(false);
  regError = signal('');

  // Step: login
  loginSuffix = '';
  loginPassword = '';
  loginError = signal('');

  // Step: avatar
  avatarIcons = AVATAR_ICONS;
  avatarBgColors = AVATAR_COLORS;
  iconColors = ICON_COLORS;
  selectedIcon = signal('coffee');
  selectedBgColor = signal('#1B2E24');
  selectedIconColor = signal('#FFFFFF');

  howItWorks = [
    { num: 1, texto: 'Visita una cafetería participante de la ruta oficial.' },
    { num: 2, texto: 'Escanea el código QR en caja para obtener tu sello digital.' },
    { num: 3, texto: 'Colecciona 15 sellos y desbloquea el premio final.' },
  ];

  ngAfterViewInit(): void {}

  // ── Paso 1: Validar código ──────────────────────────────────
  validateActivationCode(): void {
    if (this.auth.validateCode(this.activationCode)) {
      this.codeError.set(false);
      this.activationStep.set('register');
    } else {
      this.codeError.set(true);
    }
  }

  isStepDone(step: string): boolean {
    const order = ['code', 'register', 'avatar', 'success'];
    return order.indexOf(this.activationStep()) > order.indexOf(step);
  }

  // ── Paso 2: Validar y avanzar al avatar ─────────────────────
  goToAvatar(): void {
    if (!this.regNombre.trim()) { this.regError.set('El nombre es requerido.'); return; }
    if (!this.regApellido.trim()) { this.regError.set('El apellido es requerido.'); return; }
    if (!this.regFechaNacimiento) { this.regError.set('La fecha de nacimiento es requerida.'); return; }
    if (this.regPassword.length < 6) { this.regError.set('La contraseña debe tener al menos 6 caracteres.'); return; }
    this.regError.set('');
    this.activationStep.set('avatar');
  }

  // ── Paso 3: Completar registro ───────────────────────────────
  completeRegistration(): void {
    this.auth.register({
      nombre: this.regNombre.trim(),
      apellido: this.regApellido.trim(),
      fechaNacimiento: this.regFechaNacimiento,
      password: this.regPassword,
      codigoActivacion: this.activationCode,
      avatar: {
        icon: this.selectedIcon(),
        bgColor: this.selectedBgColor(),
        iconColor: this.selectedIconColor(),
      },
    });
    this.activationStep.set('success');
  }

  // ── Login ────────────────────────────────────────────────────
  doLogin(): void {
    if (!this.loginSuffix.trim() || !this.loginPassword) {
      this.loginError.set('Ingresa tu código y contraseña.');
      return;
    }
    const success = this.auth.login(this.loginSuffix, this.loginPassword);
    if (success) {
      this.loginError.set('');
      // The view automatically switches because auth.isAuthenticated() becomes true.
    } else {
      this.loginError.set('Código o contraseña incorrectos.');
    }
  }

  // ── Scanner ───────────────────────────────────────────────────
  private ngZone = inject(NgZone);

  async startScanner(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      // Run scanner outside Angular zone to prevent its timers from triggering change detection
      this.ngZone.runOutsideAngular(() => {
        this.html5QrCode = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 220, height: 220 } }, false);
        this.html5QrCode.render(
          (text: string) => this.ngZone.run(() => this.onScanSuccess(text)),
          () => {}
        );
      });
      this.scannerStarted.set(true);
    } catch (err) { console.error('QR Scanner error:', err); }
  }

  private onScanSuccess(text: string): void {
    const cafe = this.data.cafeterias().find(c => c.id === text || text.includes(c.nombre))
      ?? this.data.cafeterias()[0];
    this.data.agregarSello(cafe.id);
    this.scannedCafeInfo = cafe;
    this.scanResult.set(`Sello de ${cafe.nombre} agregado a tu pasaporte`);
    this.stopScanner();
  }

  stopScanner(): void {
    const scanner = this.html5QrCode;
    if (scanner) {
      this.html5QrCode = null;
      // Clean up outside Angular zone so it doesn't interfere with the new route's rendering
      this.ngZone.runOutsideAngular(() => {
        try { scanner.clear(); } catch {}
      });
    }
    this.scannerStarted.set(false);
  }

  resetScanner(): void { 
    this.scanResult.set(null); 
    this.scannerStarted.set(false); 
    this.notaGuardada.set(false);
    this.notaCata = '';
    this.calificacionCata = 5;
    this.scannedCafeInfo = null;
  }

  activateManual(): void {
    const id = this.selectedCafeId();
    if (!id) return;
    const cafe = this.data.getCafeteria(id);
    if (!cafe) return;
    this.data.agregarSello(id);
    this.scannedCafeInfo = cafe;
    this.mode.set('qr');
    this.scanResult.set(`Sello de ${cafe.nombre} agregado a tu pasaporte`);
    this.selectedCafeId.set(null);
  }

  guardarNotaRapida(): void {
    if (!this.scannedCafeInfo) return;
    this.data.agregarCata({
      cafeteriaId: this.scannedCafeInfo.id,
      cafeteriaNombre: this.scannedCafeInfo.nombre,
      fecha: new Date(),
      metodo: 'Visita',
      nota: this.notaCata.trim() || 'Sin notas adicionales',
      calificacion: this.calificacionCata,
      sabores: []
    });
    this.notaGuardada.set(true);
  }

  onCodeInput(e: Event): void { this.manualCode = (e.target as HTMLInputElement).value.toUpperCase(); }

  ngOnDestroy(): void { this.stopScanner(); }
}
