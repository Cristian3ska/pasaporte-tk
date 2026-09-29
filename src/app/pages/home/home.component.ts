import { Component, inject, signal, computed, ApplicationRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div>

      <!-- ══════════════════════════════════════════
           PAGE HEADER (Sticky)
      ══════════════════════════════════════════ -->
      <header class="bg-white px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between sticky top-0 z-20 border-b border-gray-100">
        <!-- Mobile Logo -->
        <div class="flex items-center gap-2.5 lg:hidden">
          <div class="w-9 h-9 bg-verde-900 rounded-xl flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-verde-900 tracking-wider uppercase leading-none">Pasaporte Café</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Inicio</p>
          </div>
        </div>

        <!-- Desktop Page Title -->
        <div class="hidden lg:block">
          <h1 class="text-xl font-bold text-gray-900">Inicio</h1>
          <p class="text-sm text-gray-500">Ruta Oficial 2026 — Tecamachalco</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Badge online -->
          <div class="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            <span class="w-2 h-2 rounded-full bg-verde-500 animate-pulse-dot"></span>
            Edición Tecamachalco
          </div>
          @if (auth.isAuthenticated()) {
            <button (click)="auth.toggleProfile()" class="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden shadow-sm active:scale-95 transition-all"
                 [style.background-color]="auth.user()?.avatar?.bgColor || '#1B2E24'">
              <lucide-icon [name]="auth.user()?.avatar?.icon || 'coffee'"
                           class="w-5 h-5"
                           [style.color]="auth.user()?.avatar?.iconColor || '#FFFFFF'">
              </lucide-icon>
            </button>
          } @else {
            <a routerLink="/activar" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full flex items-center justify-center text-gray-600">
              <lucide-icon name="user" class="w-5 h-5"></lucide-icon>
            </a>
          }
        </div>
      </header>

      <!-- ══════════════════════════════════════════
           MAIN CONTENT GRID
      ══════════════════════════════════════════ -->
      <div class="px-0 sm:px-6 lg:px-8 xl:px-10 py-0 sm:py-6 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 xl:gap-8 max-w-screen-2xl mx-auto">

        <!-- ─────────────────────────────────
             LEFT COLUMN (main content)
        ───────────────────────────────── -->
        <div class="space-y-6">

          <!-- NEW MOBILE HERO -->
          <div class="lg:hidden relative -mx-4 sm:-mx-6 mb-4">
            <!-- BACKGROUND IMAGE (Edge to edge) -->
            <div class="absolute top-0 left-0 right-0 h-72 z-0 overflow-hidden">
               <img src="/convento.webp" alt="Convento de Tecamachalco" class="w-full h-full object-cover object-top">
               <!-- White gradient at the bottom to blend with the card -->
               <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </div>

            <!-- FOREGROUND CONTENT -->
            <div class="relative z-10 pt-4">
              <!-- Top badge pill -->
              <div class="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-full px-4 py-3 mx-4 border border-white/50 shadow-sm">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-verde-500"></div>
                  <span class="text-[10px] font-bold text-verde-900 tracking-wider">RUTA OFICIAL 2026</span>
                </div>
                <div class="flex items-center gap-1 text-[10px] text-gray-800 font-bold">
                  Edición Tecamachalco
                  <lucide-icon name="check-circle" class="w-3.5 h-3.5 text-gray-900"></lucide-icon>
                </div>
              </div>

              <!-- Spacing to reveal image -->
              <div class="h-60 "></div>

              <!-- White Card -->
              <div class="bg-gray-50 rounded-t-[2.5rem] px-5 pt-5 pb-2">
                <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                  <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Puebla, México</p>
                  <h2 class="text-3xl font-black text-gray-900 leading-tight mb-3">Recorre Tecamachalco taza a taza.</h2>
                  <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                    15 cafeterías participantes y 15 sellos únicos. Descubre nuevos sabores, apoya el comercio local y completa tu recorrido.
                  </p>
                  <a routerLink="/mapa" class="flex items-center justify-center w-full bg-[#1a2f22] hover:bg-[#112017] text-white font-semibold py-4 rounded-full mb-2 text-sm transition-all active:scale-95 shadow-md">
                    Explorar el Mapa <lucide-icon name="arrow-right" class="w-4 h-4 ml-2"></lucide-icon>
                  </a>
                  <a routerLink="/activar" class="flex items-center justify-center w-full text-gray-700 font-semibold py-3 text-sm transition-all active:scale-95 hover:bg-gray-50 rounded-full">
                    Vincular pasaporte impreso <lucide-icon name="chevron-right" class="w-4 h-4 ml-1"></lucide-icon>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- DESKTOP HERO (Hidden on mobile) -->
          <div class="hidden lg:block relative rounded-3xl overflow-hidden mx-4 sm:mx-0" style="min-height: 260px;">
            <div class="absolute inset-0 bg-gray-200">
              <img src="/convento.webp" alt="Convento de Tecamachalco" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

            <!-- Hero Text Overlay -->
            <div class="relative h-full flex flex-col justify-center p-8 lg:p-12" style="min-height: 260px;">
              <p class="text-cafe-300 text-xs font-bold uppercase tracking-widest mb-2">Puebla, México</p>
              <h2 class="font-display text-white text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Recorre Tecamachalco<br>taza a taza.
              </h2>
              <p class="text-gray-200 text-base leading-relaxed mb-6 max-w-lg">
                15 cafeterías participantes y 15 sellos únicos.
                Descubre nuevos sabores, apoya el comercio local y completa tu recorrido.
              </p>
              <div class="flex flex-row gap-3">
                <a routerLink="/mapa"
                   class="flex items-center justify-center gap-2 bg-[#1a2f22] hover:bg-[#112017] text-white font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md">
                  Explorar el Mapa
                  <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
                </a>
                <a routerLink="/activar"
                   class="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white font-semibold px-6 py-3.5 rounded-full text-sm border border-white/20 hover:bg-white/20 transition-all">
                  Vincular pasaporte
                </a>
              </div>
            </div>
          </div>

          <!-- STATS ROW -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 sm:px-0">
            @for (stat of stats; track stat.label) {
              <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center flex flex-col justify-center">
                <p class="text-3xl font-black mb-1" [style.color]="stat.color">{{ stat.value }}</p>
                <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{{ stat.label }}</p>
              </div>
            }
          </div>

          <!-- MINI MAP + FILTER CHIPS -->
          <div class="px-4 sm:px-0">
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="text-lg font-bold text-gray-900">Ruta de Especialidad</p>
                <p class="text-sm text-gray-500">Descubre la ubicación de cada barra.</p>
              </div>
              <a routerLink="/mapa" class="btn-ghost text-xs hidden sm:flex">Ver mapa completo ›</a>
            </div>

            <!-- Filter chips -->
            <div class="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
              @for (chip of filterChips; track chip.label) {
                <button (click)="activeFilter.set(chip.value)"
                        class="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
                        [class.bg-verde-900]="activeFilter() === chip.value"
                        [class.text-white]="activeFilter() === chip.value"
                        [class.bg-white]="activeFilter() !== chip.value"
                        [class.text-gray-700]="activeFilter() !== chip.value"
                        [class.shadow-card]="activeFilter() !== chip.value">
                  @if (chip.icon) { <lucide-icon [name]="chip.icon" class="w-4 h-4"></lucide-icon> }
                  {{ chip.label }}
                </button>
              }
            </div>

            <!-- Mini map -->
            <a routerLink="/mapa" class="block card cursor-pointer active:scale-[0.99] transition-transform">
              <div class="relative overflow-hidden" style="height: 220px;">
                <div class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100">
                  <svg class="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#86d488" stroke-width="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                    <line x1="0" y1="100" x2="100%" y2="100" stroke="#4eba4e" stroke-width="1.5" opacity="0.5"/>
                    <line x1="0" y1="160" x2="100%" y2="160" stroke="#4eba4e" stroke-width="2" opacity="0.4"/>
                    <line x1="100" y1="0" x2="100" y2="100%" stroke="#4eba4e" stroke-width="1" opacity="0.4"/>
                    <line x1="220" y1="0" x2="220" y2="100%" stroke="#4eba4e" stroke-width="1.5" opacity="0.4"/>
                    <line x1="380" y1="0" x2="380" y2="100%" stroke="#4eba4e" stroke-width="1" opacity="0.4"/>
                    <line x1="550" y1="0" x2="550" y2="100%" stroke="#4eba4e" stroke-width="1.5" opacity="0.4"/>
                  </svg>
                  @for (cafe of data.cafeterias(); track cafe.id; let i = $index) {
                    <div class="absolute" [style.top.px]="cafePositions[i].top" [style.left.%]="cafePositions[i].left">
                      <div class="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"
                           [style.background-color]="cafe.color">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                          <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                        </svg>
                      </div>
                      <p class="text-[9px] font-bold text-gray-700 text-center mt-0.5 whitespace-nowrap max-w-16 truncate">{{ cafe.nombre }}</p>
                    </div>
                  }
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 flex items-center justify-between">
                  <span class="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">Ruta Centro y Barrios</span>
                  <span class="bg-verde-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" class="w-3.5 h-3.5">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                    </svg>
                    {{ data.totalCafeterias() }} cafeterías →
                  </span>
                </div>
              </div>
            </a>
          </div>

          <!-- CAFETERÍAS GRID -->
          <div class="px-4 sm:px-0">
            <div class="flex items-center justify-between mb-3">
              <p class="text-lg font-bold text-gray-900">Cafeterías de la ruta</p>
              <a routerLink="/mapa" class="btn-ghost text-xs">Ver todas ({{ data.totalCafeterias() }}) ›</a>
            </div>

            <!-- Responsive grid: 1 col mobile, 2 col sm, 2-3 col md+, 2 col xl (inside grid layout) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
              @for (cafe of data.cafeterias(); track cafe.id) {
                <div class="bg-white rounded-3xl shadow-card overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                     (click)="openCafeDetail(cafe.id)">
                  <!-- Color header -->
                  <div class="h-32 sm:h-36 flex items-center justify-center relative"
                       [style.background-color]="cafe.color + '18'">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                         [style.background-color]="cafe.color">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                      </svg>
                    </div>
                    <div class="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      ★ {{ cafe.calificacion }}
                    </div>
                    @if (cafe.visitada) {
                      <div class="absolute top-3 right-3 bg-verde-900 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon> Visitada
                      </div>
                    }
                    <!-- Distance badge -->
                    @if (cafe.distancia) {
                      <div class="absolute bottom-3 right-3 bg-white/90 text-gray-700 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <lucide-icon name="map-pin" class="w-3 h-3 text-verde-700"></lucide-icon> {{ cafe.distancia }}
                      </div>
                    }
                  </div>
                  <div class="p-4">
                    <p class="font-bold text-base text-gray-900 leading-tight">{{ cafe.nombre }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 truncate">{{ cafe.direccion }}</p>
                    <div class="flex flex-wrap gap-1 mt-2">
                      @for (tag of cafe.etiquetas.slice(0, 2); track tag) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafe-100 text-cafe-800">{{ tag }}</span>
                      }
                    </div>
                    <div class="mt-3 flex items-center justify-between">
                      <span class="text-xs font-semibold" [class.text-verde-700]="cafe.abierto" [class.text-red-500]="!cafe.abierto">
                        {{ cafe.abierto ? '● Abierto' : '● Cerrado' }}
                        <span class="text-gray-400 font-normal ml-1">{{ cafe.horario }}</span>
                      </span>
                      <a [routerLink]="['/mapa']" class="text-xs text-verde-900 font-semibold hover:text-verde-700 transition-colors">
                        Ver más →
                      </a>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- NOVEDADES -->
          <div class="px-4 sm:px-0">
            <div class="flex items-center justify-between mb-3">
              <p class="text-lg font-bold text-gray-900">Novedades</p>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-verde-100 text-verde-800">
                <span class="w-1.5 h-1.5 rounded-full bg-verde-600 mr-1 animate-pulse-dot"></span>
                Actualizado
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              @for (novedad of data.novedades(); track novedad.id) {
                <div class="bg-white rounded-3xl shadow-card p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         [class.bg-verde-100]="novedad.tipo === 'novedad'"
                         [class.bg-cafe-100]="novedad.tipo === 'lanzamiento'"
                         [class.bg-blue-100]="novedad.tipo === 'evento'">
                      <div class="text-gray-700 flex items-center justify-center">
                        <lucide-icon [name]="novedad.tipo === 'evento' ? 'calendar' : novedad.tipo === 'lanzamiento' ? 'rocket' : 'megaphone'" class="w-5 h-5"></lucide-icon>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-sm font-bold text-gray-900 leading-tight">{{ novedad.titulo }}</p>
                        <span class="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {{ novedad.fecha | date: 'd MMM' : '' : 'es' }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ novedad.descripcion }}</p>
                      @if (novedad.cafeteria) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafe-100 text-cafe-800 mt-2">{{ novedad.cafeteria }}</span>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- QUOTE -->
          <div class="xl:hidden bg-[#1a2f22] rounded-3xl p-6 text-center mx-4 sm:mx-0">
            <div class="w-10 h-10 bg-cafe-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
              </svg>
            </div>
            <blockquote class="text-cafe-100 text-sm leading-relaxed italic font-display">
              "El café une historias, fortalece comunidades y honra a quienes cuidan la tierra en cada taza."
            </blockquote>
            <p class="text-cafe-400 text-[10px] font-bold uppercase tracking-widest mt-3">
              Colectivo de Cafeterías de Tecamachalco
            </p>
          </div>

        </div><!-- /LEFT COLUMN -->

        <!-- ─────────────────────────────────
             RIGHT SIDEBAR (xl+)
        ───────────────────────────────── -->
        <aside class="hidden xl:flex flex-col gap-5">

          <!-- PROGRESS CARD -->
          <div class="bg-verde-900 rounded-3xl p-5 text-white">
            <p class="text-verde-300 text-[10px] font-bold uppercase tracking-widest mb-1">MI PASAPORTE ACTIVO</p>
            <div class="flex items-center justify-between mb-4">
              <p class="text-lg font-bold">{{ data.totalSellos() }} / 15 sellos</p>
              <div class="w-12 h-12 rounded-full bg-verde-800 flex items-center justify-center relative">
                <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#2d6b1c" stroke-width="4"/>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#86d488" stroke-width="4"
                          [attr.stroke-dasharray]="126"
                          [attr.stroke-dashoffset]="126 - (126 * data.progresoPorcentaje() / 100)"
                          stroke-linecap="round"/>
                </svg>
                <span class="text-xs font-bold text-white relative z-10">{{ data.progresoPorcentaje() }}%</span>
              </div>
            </div>
            <!-- Stamp grid mini -->
            <div class="grid grid-cols-5 gap-1.5 mb-4">
              @for (i of getArray(15); track i) {
                <div class="aspect-square rounded-lg flex items-center justify-center text-xs transition-all"
                     [class.bg-verde-600]="i < data.totalSellos()"
                     [class.bg-verde-800]="i >= data.totalSellos()">
                  @if (i < data.totalSellos()) {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" class="w-3 h-3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  }
                </div>
              }
            </div>
            <a routerLink="/pasaporte"
               class="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2.5 rounded-2xl text-sm transition-all">
              Ver mi pasaporte →
            </a>
          </div>

          <!-- PUNTOS DE VENTA -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-cafe-100 rounded-lg flex items-center justify-center text-cafe-700">
                  <lucide-icon name="book-open" class="w-4 h-4"></lucide-icon>
                </div>
                <p class="text-sm font-bold text-gray-900">Pasaporte Físico</p>
              </div>
              <span class="bg-verde-900 text-white text-xs font-bold px-3 py-1 rounded-full">$150 MXN</span>
            </div>
            <div class="space-y-2.5">
              @for (punto of data.puntosVenta; track punto.id) {
                <div class="flex items-center gap-3 p-3 rounded-2xl"
                     [class.bg-gray-50]="!punto.proxima"
                     [class.bg-yellow-50]="punto.proxima">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                       [class.bg-verde-100]="!punto.proxima"
                       [class.bg-yellow-100]="punto.proxima">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         [attr.stroke]="punto.proxima ? '#d97706' : '#1a650c'"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-gray-900 truncate">{{ punto.nombre }}</p>
                    <p class="text-[11px] text-gray-500 truncate">{{ punto.direccion }}</p>
                  </div>
                  @if (!punto.proxima) {
                    <span class="text-[10px] font-bold text-verde-700 bg-verde-100 px-2 py-0.5 rounded-full flex-shrink-0">{{ punto.disponibles }}</span>
                  } @else {
                    <span class="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full flex-shrink-0">Pronto</span>
                  }
                </div>
              }
            </div>
            <a routerLink="/activar"
               class="flex items-center justify-center gap-2 bg-verde-900 hover:bg-verde-800 text-white font-semibold px-4 py-2.5 rounded-2xl text-sm transition-all mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" class="w-4 h-4">
                <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/>
              </svg>
              Activar pasaporte
            </a>
          </div>

          <!-- QUOTE (desktop sidebar) -->
          <div class="bg-cafe-900 rounded-3xl p-5 text-center">
            <div class="mb-3 flex justify-center text-cafe-300">
              <lucide-icon name="coffee" class="w-8 h-8"></lucide-icon>
            </div>
            <blockquote class="text-cafe-100 text-sm leading-relaxed italic font-display">
              "El café une historias, fortalece comunidades y honra a quienes cuidan la tierra en cada taza."
            </blockquote>
            <p class="text-cafe-400 text-[10px] font-bold uppercase tracking-widest mt-3">
              Colectivo de Cafeterías de Tecamachalco
            </p>
          </div>

          <!-- QUICK ACTIONS -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <p class="text-sm font-bold text-gray-900 mb-3">Acciones rápidas</p>
            <div class="space-y-2">
              <a routerLink="/mapa" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-verde-50 hover:text-verde-900 transition-all group">
                <div class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-verde-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4.5 h-4.5 text-verde-900">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 group-hover:text-verde-900">Ver mapa completo</span>
              </a>
              <a routerLink="/activar" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-cafe-50 hover:text-cafe-900 transition-all group">
                <div class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-cafe-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4.5 h-4.5 text-cafe-700">
                    <rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/>
                    <rect width="5" height="5" x="3" y="16" rx="1"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 group-hover:text-cafe-900">Escanear QR</span>
              </a>
              <a routerLink="/pasaporte" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-all group">
                <div class="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4.5 h-4.5 text-blue-600">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-700 group-hover:text-blue-900">Mi diario de catas</span>
              </a>
            </div>
          </div>

        </aside><!-- /RIGHT SIDEBAR -->

      </div><!-- /MAIN GRID -->

    </div>

    <!-- ══════════════════════════════════════════
         BOTTOM SHEET: Detalle Cafetería
    ══════════════════════════════════════════ -->
    @if (selectedCafeId()) {
      <div class="bottom-sheet-overlay" (click)="closeCafeDetail()"></div>
      <div class="bottom-sheet pb-4 lg:fixed lg:bottom-8 lg:right-8 lg:left-auto lg:w-96 lg:rounded-3xl lg:max-h-[80vh] animate-slide-up">
        <div class="flex justify-center pt-3 pb-4 lg:hidden">
          <div class="w-10 h-1 bg-gray-200 rounded-full"></div>
        </div>
        <!-- Desktop close btn -->
        <button (click)="closeCafeDetail()"
                class="hidden lg:flex absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full items-center justify-center text-gray-500 hover:bg-gray-200 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
        @if (selectedCafe()) {
          <div class="px-5 pb-6">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                   [style.background-color]="selectedCafe()!.color">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900">{{ selectedCafe()!.nombre }}</h2>
                <p class="text-sm text-gray-500 mt-0.5">{{ selectedCafe()!.direccion }}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span class="text-yellow-500 font-bold text-sm">★ {{ selectedCafe()!.calificacion }}</span>
                  <span class="text-xs font-medium" [class.text-verde-700]="selectedCafe()!.abierto" [class.text-red-500]="!selectedCafe()!.abierto">
                    {{ selectedCafe()!.abierto ? '● Abierto' : '● Cerrado' }}
                  </span>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ selectedCafe()!.descripcion }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              @for (m of selectedCafe()!.metodos; track m) {
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafe-100 text-cafe-800">{{ m }}</span>
              }
            </div>
            <div class="grid grid-cols-2 gap-3">
              <a routerLink="/mapa" (click)="closeCafeDetail()"
                 class="flex items-center justify-center gap-2 bg-verde-900 hover:bg-verde-800 text-white font-semibold px-4 py-3 rounded-2xl text-sm transition-all">
                Ver en mapa
              </a>
              <a routerLink="/activar" (click)="closeCafeDetail()"
                 class="flex items-center justify-center gap-2 border-2 border-verde-900 text-verde-900 font-semibold px-4 py-3 rounded-2xl text-sm transition-all hover:bg-verde-50">
                Obtener sello
              </a>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class HomeComponent implements OnInit {
  data = inject(DataService);
  auth = inject(AuthService);
  private appRef = inject(ApplicationRef);
  activeFilter = signal<string>('todas');
  selectedCafeId = signal<string | null>(null);

  ngOnInit(): void {
    // Force a complete application-wide change detection pass
    // after this component initializes, ensuring ALL template
    // bindings (including signals from injected services) are resolved.
    // requestAnimationFrame ensures we run AFTER the current rendering frame.
    requestAnimationFrame(() => {
      this.appRef.tick();
    });
  }

  selectedCafe = computed(() => {
    const id = this.selectedCafeId();
    return id ? this.data.getCafeteria(id) : null;
  });

  filterChips = [
    { label: 'Todas (5)', value: 'todas', icon: '' },
    { label: 'Abiertas', value: 'abiertas', icon: 'circle-dot' },
    { label: 'Cold Brew', value: 'cold-brew', icon: 'droplets' },
    { label: 'Specialty', value: 'specialty', icon: 'award' },
  ];

  cafePositions = [
    { top: 50, left: 12 },
    { top: 90, left: 35 },
    { top: 40, left: 58 },
    { top: 110, left: 72 },
    { top: 70, left: 88 },
  ];

  stats = [
    { value: '5', label: 'Cafeterías', color: '#1a650c' },
    { value: '15', label: 'Sellos únicos', color: '#c06b21' },
    { value: '0', label: 'Tus sellos', color: '#7e3f1e' },
    { value: '0%', label: 'Completado', color: '#2d9e2f' },
  ];

  getArray(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  openCafeDetail(id: string): void { this.selectedCafeId.set(id); }
  closeCafeDetail(): void { this.selectedCafeId.set(null); }
}
