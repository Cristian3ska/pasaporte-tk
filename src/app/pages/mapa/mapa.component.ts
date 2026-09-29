import { Component, inject, signal, computed, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Cafeteria } from '../../models/cafeteria.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <!-- ═══════════════════════════════════════════════════
         MAPA — Layout Responsive
         Mobile/Tablet : full-screen map + bottom sheet
         Desktop (lg+) : side panel + full map
    ═══════════════════════════════════════════════════ -->
    <div class="flex flex-col lg:flex-row h-full animate-fade-in overflow-hidden">

      <!-- ─────────────────────────────────
           SIDE PANEL (lg+)
      ───────────────────────────────── -->
      <div class="hidden lg:flex flex-col w-80 xl:w-96 bg-white border-r border-gray-100 h-full overflow-hidden flex-shrink-0">

        <!-- Panel Header -->
        <div class="px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Mapa Interactivo</h2>
          <p class="text-sm text-gray-500 mt-0.5">{{ data.cafeterias().length }} cafeterías en la ruta</p>

          <!-- Search -->
          <div class="relative mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" placeholder="Buscar cafetería..."
                   class="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-verde-300"
                   (input)="onSearch($event)">
          </div>
        </div>

        <!-- Filter chips -->
        <div class="px-5 py-3 border-b border-gray-100">
          <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button (click)="setFilter('todas')"
                    class="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    [class.bg-verde-900]="activeFilter() === 'todas'"
                    [class.text-white]="activeFilter() === 'todas'"
                    [class.border-verde-900]="activeFilter() === 'todas'"
                    [class.bg-white]="activeFilter() !== 'todas'"
                    [class.text-gray-600]="activeFilter() !== 'todas'"
                    [class.border-gray-200]="activeFilter() !== 'todas'">
              Todas
            </button>
            <button (click)="setFilter('abiertas')"
                    class="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    [class.bg-verde-900]="activeFilter() === 'abiertas'"
                    [class.text-white]="activeFilter() === 'abiertas'"
                    [class.border-verde-900]="activeFilter() === 'abiertas'"
                    [class.bg-white]="activeFilter() !== 'abiertas'"
                    [class.text-gray-600]="activeFilter() !== 'abiertas'"
                    [class.border-gray-200]="activeFilter() !== 'abiertas'">
              <lucide-icon name="circle-dot" class="w-3 h-3"></lucide-icon> Abiertas
            </button>
            <button (click)="setFilter('visitadas')"
                    class="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    [class.bg-cafe-700]="activeFilter() === 'visitadas'"
                    [class.text-white]="activeFilter() === 'visitadas'"
                    [class.border-cafe-700]="activeFilter() === 'visitadas'"
                    [class.bg-white]="activeFilter() !== 'visitadas'"
                    [class.text-gray-600]="activeFilter() !== 'visitadas'"
                    [class.border-gray-200]="activeFilter() !== 'visitadas'">
              <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon> Visitadas
            </button>
          </div>
        </div>

        <!-- Cafeteria List -->
        <div class="flex-1 overflow-y-auto">
          @for (cafe of filteredCafes(); track cafe.id) {
            <button (click)="focusCafeteria(cafe)"
                    class="w-full flex items-start gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-all text-left"
                    [class.bg-verde-50]="selectedCafe()?.id === cafe.id">
              <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                   [style.background-color]="cafe.color">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <p class="font-semibold text-sm text-gray-900 truncate">{{ cafe.nombre }}</p>
                  @if (cafe.distancia) {
                    <span class="text-xs text-gray-400 flex-shrink-0">{{ cafe.distancia }}</span>
                  }
                </div>
                <p class="text-xs text-gray-500 truncate mt-0.5">{{ cafe.direccion }}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span class="text-yellow-500 text-xs font-bold">★ {{ cafe.calificacion }}</span>
                  <span class="text-xs font-medium"
                        [class.text-verde-700]="cafe.abierto"
                        [class.text-red-500]="!cafe.abierto">
                    {{ cafe.abierto ? '● Abierto' : '● Cerrado' }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-1 mt-1.5">
                  @for (tag of cafe.etiquetas.slice(0, 2); track tag) {
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-cafe-100 text-cafe-800">{{ tag }}</span>
                  }
                </div>
              </div>
            </button>
          }
        </div>

        <!-- Selected cafe detail panel -->
        @if (selectedCafe()) {
          <div class="border-t border-gray-200 bg-crema-50 p-4 animate-slide-up">
            <h3 class="font-bold text-gray-900">{{ selectedCafe()!.nombre }}</h3>
            <p class="text-xs text-gray-500 mt-0.5 mb-3">{{ selectedCafe()!.descripcion }}</p>
            <button (click)="showCafeDetail.set(true)"
               class="w-full flex items-center justify-center gap-2 bg-verde-900 hover:bg-verde-800 text-white font-semibold px-4 py-2.5 rounded-2xl text-sm transition-all">
              Ver más →
            </button>
          </div>
        }

      </div>

      <!-- ─────────────────────────────────
           MAP AREA
      ───────────────────────────────── -->
      <div class="flex-1 flex flex-col relative">

        <!-- Mobile Header + search -->
        <div class="lg:hidden bg-white px-4 pt-4 pb-3 border-b border-gray-100 flex flex-col gap-3 z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 bg-verde-900 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" class="w-4 h-4">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-verde-900 uppercase tracking-wider leading-none">Pasaporte Café</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest">Mapa</p>
              </div>
            </div>
            <button class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-gray-600">
                <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
            </button>
          </div>
          <!-- Mobile search -->
          <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input type="text" placeholder="Buscar cafetería..."
                   class="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-verde-300"
                   (input)="onSearch($event)">
          </div>
          <!-- Mobile filter chips -->
          <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button (click)="setFilter('todas')"
                    class="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    [class.bg-verde-900]="activeFilter() === 'todas'"
                    [class.text-white]="activeFilter() === 'todas'"
                    [class.border-verde-900]="activeFilter() === 'todas'"
                    [class.bg-white]="activeFilter() !== 'todas'"
                    [class.text-gray-700]="activeFilter() !== 'todas'"
                    [class.border-gray-200]="activeFilter() !== 'todas'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3 h-3">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
              </svg>
              Ver todas
            </button>
            @for (cafe of data.cafeterias(); track cafe.id) {
              <button (click)="focusCafeteria(cafe)"
                      class="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                      [class.text-white]="selectedCafe()?.id === cafe.id"
                      [class.border-transparent]="selectedCafe()?.id === cafe.id"
                      [class.bg-white]="selectedCafe()?.id !== cafe.id"
                      [class.text-gray-700]="selectedCafe()?.id !== cafe.id"
                      [class.border-gray-200]="selectedCafe()?.id !== cafe.id"
                      [style.background-color]="selectedCafe()?.id === cafe.id ? cafe.color : ''">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3 h-3">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
                {{ cafe.nombre }}
              </button>
            }
          </div>
        </div>

        <!-- MAP -->
        <div class="relative flex-1">
          <div id="map" class="w-full h-full"></div>

          <!-- Location button -->
          <button (click)="goToMyLocation()"
                  class="absolute bottom-4 right-4 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center z-[400] border border-gray-200 hover:shadow-xl transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a650c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>
            </svg>
          </button>

          <!-- Zoom controls (desktop) -->
          <div class="hidden lg:flex flex-col absolute bottom-4 left-4 z-[400] gap-1">
            <button (click)="zoomIn()"
                    class="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-lg">
              +
            </button>
            <button (click)="zoomOut()"
                    class="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-lg">
              −
            </button>
          </div>

          <!-- Stats overlay (desktop) -->
          <div class="hidden lg:flex absolute top-4 right-4 z-[400] gap-2">
            <div class="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-gray-100 text-center">
              <p class="text-xs font-bold text-verde-900">{{ data.cafeterias().length }}</p>
              <p class="text-[10px] text-gray-500">Cafeterías</p>
            </div>
            <div class="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-gray-100 text-center">
              <p class="text-xs font-bold text-green-600">{{ data.cafeteriasAbiertas() }}</p>
              <p class="text-[10px] text-gray-500">Abiertas</p>
            </div>
          </div>
        </div>

        <!-- MOBILE BOTTOM SHEET: Cafe Detail -->
        @if (selectedCafe() && !showCafeDetail()) {
          <div class="lg:hidden fixed left-0 right-0 z-[400] bg-crema-50 border-t border-crema-200 p-5 animate-slide-up rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
               style="bottom: 4.5rem; padding-bottom: max(1.25rem, env(safe-area-inset-bottom))">
            <div class="flex justify-center mb-3">
              <div class="w-10 h-1 bg-crema-300 rounded-full"></div>
            </div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center" [style.background-color]="selectedCafe()!.color">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" class="w-6 h-6">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">{{ selectedCafe()!.nombre }}</h3>
                <p class="text-xs text-gray-500">{{ selectedCafe()!.horario }}</p>
              </div>
            </div>
            <button (click)="showCafeDetail.set(true)" class="w-full flex items-center justify-center gap-2 bg-verde-900 text-white font-semibold px-4 py-3 rounded-2xl text-sm hover:bg-verde-800 transition-all">
              Ver más
            </button>
          </div>
        }

        <!-- FULL SCREEN CAFE DETAIL OVERLAY -->
        @if (showCafeDetail() && selectedCafe()) {
          <div class="fixed inset-0 z-[500] flex items-center justify-center p-0 lg:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div class="bg-gray-50 w-full h-full lg:h-auto lg:max-h-[90vh] lg:max-w-2xl lg:rounded-3xl overflow-y-auto flex flex-col relative shadow-2xl pb-24 lg:pb-0">
              <!-- Header Image -->
              <div class="relative h-64 lg:h-72 bg-gray-200 flex-shrink-0 lg:rounded-t-3xl overflow-hidden">
                @if (selectedCafe()!.imagenUrl) {
                  <img [src]="selectedCafe()!.imagenUrl" class="w-full h-full object-cover">
                } @else {
                  <div class="w-full h-full flex items-center justify-center" [style.background-color]="selectedCafe()!.color">
                    <lucide-icon name="coffee" class="w-16 h-16 text-white/30"></lucide-icon>
                  </div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <button (click)="showCafeDetail.set(false)" class="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-gray-900 hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
                </button>

                <div class="absolute bottom-4 left-4 flex gap-2">
                  <div class="bg-gray-900/80 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <div class="w-2 h-2 rounded-full" [class.bg-green-400]="selectedCafe()!.abierto" [class.bg-gray-400]="!selectedCafe()!.abierto"></div>
                    {{ selectedCafe()!.abierto ? 'Abierto' : 'Cerrado' }} · {{ selectedCafe()!.horario }}
                  </div>
                </div>
                <div class="absolute bottom-4 right-4 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <lucide-icon name="star" class="w-3.5 h-3.5 text-verde-900"></lucide-icon>
                  {{ selectedCafe()!.calificacion }} ({{ selectedCafe()!.totalResenas || 0 }})
                </div>
              </div>

              <div class="p-5">
                @if (selectedCafe()!.certificada) {
                  <div class="inline-flex items-center gap-1.5 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    <lucide-icon name="check-circle" class="w-3.5 h-3.5"></lucide-icon> Barra Certificada
                  </div>
                }
                <h1 class="text-3xl font-black text-gray-900 leading-tight mb-2">{{ selectedCafe()!.nombre }}</h1>
                <p class="text-sm text-gray-600 mb-6 leading-relaxed">{{ selectedCafe()!.direccion }}</p>

                <!-- Bebida Insignia -->
                @if (selectedCafe()!.bebidaInsignia) {
                  <div class="bg-verde-900 rounded-2xl p-4 text-white mb-6 shadow-md flex items-start gap-4">
                    <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <lucide-icon name="coffee" class="w-6 h-6 text-white"></lucide-icon>
                    </div>
                    <div>
                      <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Bebida Insignia</p>
                      <p class="font-bold text-lg mb-2 leading-tight">{{ selectedCafe()!.bebidaInsignia }}</p>
                      <div class="flex flex-wrap gap-1.5">
                        @for (tag of selectedCafe()!.bebidaTags; track tag) {
                          <span class="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-medium">{{ tag }}</span>
                        }
                      </div>
                    </div>
                  </div>
                }

                <!-- Perfil de origen -->
                @if (selectedCafe()!.perfilOrigen) {
                  <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <lucide-icon name="leaf" class="w-4 h-4 text-verde-900"></lucide-icon> Perfil de Origen
                  </h3>
                  <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                    <p class="text-sm text-gray-600 leading-relaxed">{{ selectedCafe()!.perfilOrigen }}</p>
                  </div>
                }

                <!-- Lo que encontrarás -->
                @if (selectedCafe()!.caracteristicas?.length) {
                  <h3 class="font-bold text-gray-900 mb-3">Lo que encontrarás</h3>
                  <div class="flex flex-wrap gap-2 mb-6">
                    @for (car of selectedCafe()!.caracteristicas; track car) {
                      <div class="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
                        <lucide-icon name="check-circle" class="w-4 h-4 text-verde-900"></lucide-icon>
                        <span class="text-sm font-medium text-gray-700">{{ car }}</span>
                      </div>
                    }
                  </div>
                }

                <!-- Location map mini -->
                <div class="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
                  <div class="flex items-start gap-3 flex-1 pr-4">
                    <div class="mt-1"><lucide-icon name="map-pin" class="w-5 h-5 text-gray-500"></lucide-icon></div>
                    <div>
                      <p class="text-sm font-bold text-gray-900 mb-1 leading-snug">{{ selectedCafe()!.direccion }}</p>
                      <p class="text-xs text-gray-500">Tecamachalco, Puebla</p>
                    </div>
                  </div>
                  <button class="flex items-center gap-1 font-bold text-sm text-gray-900 whitespace-nowrap">
                    Cómo llegar <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

      </div><!-- /MAP AREA -->

    </div>
  `,
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  data = inject(DataService);
  private platformId = inject(PLATFORM_ID);

  activeFilter = signal('todas');
  selectedCafe = signal<Cafeteria | null>(null);
  showCafeDetail = signal(false);
  private searchTerm = signal('');

  filteredCafes = computed(() => {
    let cafes = this.data.cafeterias();
    const term = this.searchTerm().toLowerCase();
    if (term) cafes = cafes.filter(c => c.nombre.toLowerCase().includes(term) || c.etiquetas.some(t => t.toLowerCase().includes(term)));
    if (this.activeFilter() === 'abiertas') cafes = cafes.filter(c => c.abierto);
    if (this.activeFilter() === 'visitadas') cafes = cafes.filter(c => c.visitada);
    return cafes;
  });

  private map: any;
  private markers: Map<string, any> = new Map();
  private L: any;

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.L = await import('leaflet');
    setTimeout(() => this.initMap(), 50);
  }

  private initMap(): void {
    const L = this.L.default || this.L;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    this.map = L.map('map', {
      center: [18.8998, -97.7335],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.data.cafeterias().forEach(cafe => {
      const icon = L.divIcon({
        html: `
          <div style="
            width: 40px; height: 40px; border-radius: 50%;
            background: ${cafe.color};
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 3px 12px rgba(0,0,0,0.25);
            border: 3px solid white;
            transition: transform 0.2s;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="18" height="18">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1"/>
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
            </svg>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([cafe.lat, cafe.lng], { icon })
        .addTo(this.map)
        .on('click', () => this.focusCafeteria(cafe));

      this.markers.set(cafe.id, marker);
    });
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    if (this.map) this.map.setView([18.8998, -97.7335], 15);
  }

  focusCafeteria(cafe: Cafeteria): void {
    this.selectedCafe.set(cafe);
    if (this.map) {
      this.map.setView([cafe.lat, cafe.lng], 17, { animate: true, duration: 0.8 });
    }
  }

  onSearch(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchTerm.set(val);
    const match = this.data.cafeterias().find(c => c.nombre.toLowerCase().includes(val.toLowerCase()));
    if (match && val.length > 1) this.focusCafeteria(match);
  }

  goToMyLocation(): void {
    if (!navigator.geolocation || !this.map) return;
    navigator.geolocation.getCurrentPosition(pos =>
      this.map.setView([pos.coords.latitude, pos.coords.longitude], 16, { animate: true })
    );
  }

  zoomIn(): void { this.map?.zoomIn(); }
  zoomOut(): void { this.map?.zoomOut(); }

  ngOnDestroy(): void { this.map?.remove(); }
}
