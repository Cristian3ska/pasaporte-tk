import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CataDiario } from '../../models/cafeteria.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pasaporte',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  template: `
    <div class="animate-fade-in min-h-screen bg-gray-50">

      <!-- PAGE HEADER -->
      <header class="bg-white px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div class="flex items-center gap-2.5 lg:hidden">
          <div class="w-9 h-9 bg-verde-900 rounded-xl flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-verde-900 tracking-wider uppercase leading-none">Pasaporte Café</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest">Mi Pasaporte</p>
          </div>
        </div>
        <div class="hidden lg:block">
          <h1 class="text-xl font-bold text-gray-900">Mi Pasaporte</h1>
          <p class="text-sm text-gray-500">Tu colección digital de sellos</p>
        </div>
        <button class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-gray-600">
            <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
        </button>
      </header>

      <!-- MAIN GRID -->
      <div class="px-4 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6
                  grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 max-w-screen-2xl mx-auto pb-24 lg:pb-10">

        <!-- ─────── LEFT COLUMN ─────── -->
        <div class="space-y-5">

          <!-- PASSPORT CARD -->
          <div class="rounded-3xl overflow-hidden shadow-lg"
               style="background: linear-gradient(135deg, #1a3d0f 0%, #2d6b1c 55%, #3d8c25 100%);">
            <div class="px-5 sm:px-8 pt-6 pb-4">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-green-300 text-[10px] font-bold uppercase tracking-widest">Edición 2026</p>
                  <h2 class="text-white text-xl sm:text-2xl font-display font-bold mt-0.5">Pasaporte del Café</h2>
                  <p class="text-green-300 text-xs mt-0.5">Tecamachalco, Puebla</p>
                </div>
                <div class="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" class="w-8 h-8">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
              </div>

              <div class="bg-white/10 rounded-2xl p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-white text-sm font-semibold">{{ data.totalSellos() }} / 15 sellos</span>
                  <span class="text-green-300 text-sm font-bold">{{ data.progresoPorcentaje() }}%</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2.5">
                  <div class="bg-gradient-to-r from-green-300 to-yellow-300 h-2.5 rounded-full transition-all duration-700"
                       [style.width.%]="data.progresoPorcentaje()"></div>
                </div>
                <p class="text-green-200 text-xs mt-2 flex items-center gap-1.5">
                  @if (data.totalSellos() === 0) { Escanea tu primer QR para comenzar <lucide-icon name="target" class="w-4 h-4"></lucide-icon> }
                  @else if (data.totalSellos() < 15) { ¡{{ 15 - data.totalSellos() }} sellos más para completar! }
                  @else { 🎉 ¡Completaste la ruta completa! }
                </p>
              </div>
            </div>

            <!-- Stamp grid -->
            <div class="bg-white/5 px-5 sm:px-8 pb-6">
              <p class="text-green-200 text-[10px] font-bold uppercase tracking-widest mb-3 pt-4">Sellos obtenidos</p>
              <div class="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 xl:grid-cols-8 gap-2">
                @for (i of getArray(15); track i) {
                  <div class="aspect-square rounded-xl flex items-center justify-center transition-all duration-500"
                       [class.bg-verde-600]="i < data.totalSellos()"
                       [class.shadow-md]="i < data.totalSellos()"
                       [class.bg-white]="i >= data.totalSellos()"
                       [class.opacity-20]="i >= data.totalSellos()">
                    @if (i < data.totalSellos()) {
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" class="w-4 h-4">
                        <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
                      </svg>
                    } @else {
                      <span class="text-xs font-bold text-gray-400">{{ i + 1 }}</span>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- TABS -->
          <div class="bg-white rounded-3xl shadow-card overflow-hidden">
            <div class="flex border-b border-gray-100">
              @for (tab of tabs; track tab.id) {
                <button (click)="activeTab.set(tab.id)"
                        class="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all border-b-2"
                        [class.border-verde-900]="activeTab() === tab.id"
                        [class.text-verde-900]="activeTab() === tab.id"
                        [class.border-transparent]="activeTab() !== tab.id"
                        [class.text-gray-500]="activeTab() !== tab.id">
                  <lucide-icon [name]="tab.icon" class="w-4 h-4"></lucide-icon>
                  <span class="hidden sm:inline">{{ tab.label }}</span>
                  <span class="sm:hidden">{{ tab.shortLabel }}</span>
                </button>
              }
            </div>

            <div class="p-5">

              <!-- SELLOS TAB -->
              @if (activeTab() === 'sellos') {
                @if (data.sellos().length === 0) {
                  <div class="text-center py-12">
                    <div class="mb-4 flex justify-center text-gray-400">
                      <lucide-icon name="target" class="w-12 h-12"></lucide-icon>
                    </div>
                    <p class="text-gray-900 font-bold text-lg">Sin sellos aún</p>
                    <p class="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Visita una cafetería y escanea el código QR para obtener tu primer sello.</p>
                    <a routerLink="/activar" class="inline-flex items-center justify-center gap-2 bg-verde-900 text-white font-semibold px-6 py-3 rounded-2xl text-sm mt-6 hover:bg-verde-800 transition-all">
                      Escanear QR →
                    </a>
                  </div>
                } @else {
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    @for (sello of data.sellos(); track sello.id) {
                      <div class="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
                        <div class="w-11 h-11 bg-verde-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" class="w-5 h-5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-sm text-gray-900 truncate">{{ sello.cafeteriaNombre }}</p>
                          <p class="text-xs text-gray-500 mt-0.5">{{ sello.fecha | date:'d MMM yyyy':'':'es' }}</p>
                        </div>
                        <lucide-icon name="coffee" class="w-6 h-6 text-verde-900 opacity-20"></lucide-icon>
                      </div>
                    }
                  </div>
                }
              }

              <!-- CATAS TAB -->
              @if (activeTab() === 'catas') {
                <div class="mb-4">
                  <button (click)="showNewCataForm.set(!showNewCataForm())"
                          class="flex items-center justify-center gap-2 w-full sm:w-auto sm:px-6 bg-verde-900 hover:bg-verde-800 text-white font-semibold py-3 px-4 rounded-2xl text-sm transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" class="w-4 h-4">
                      <path d="M12 5v14"/><path d="M5 12h14"/>
                    </svg>
                    {{ showNewCataForm() ? 'Cancelar' : 'Nueva entrada de cata' }}
                  </button>
                </div>

                @if (showNewCataForm()) {
                  <div class="bg-gray-50 rounded-3xl p-5 mb-4 animate-fade-in">
                    <h3 class="font-bold text-gray-900 mb-4">Nueva Cata</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select [(ngModel)]="newCata.cafeteria"
                              class="p-3 border border-gray-200 rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-verde-300">
                        <option value="">Cafetería...</option>
                        @for (cafe of data.cafeterias(); track cafe.id) {
                          <option [value]="cafe.id">{{ cafe.nombre }}</option>
                        }
                      </select>
                      <select [(ngModel)]="newCata.metodo"
                              class="p-3 border border-gray-200 rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-verde-300">
                        <option value="">Método...</option>
                        <option>Espresso</option><option>V60</option><option>Chemex</option>
                        <option>Aeropress</option><option>Cold Brew</option><option>Café de Olla</option>
                      </select>
                      <textarea [(ngModel)]="newCata.nota" rows="3"
                                placeholder="Perfil de sabor, aroma, acidez..."
                                class="sm:col-span-2 p-3 border border-gray-200 rounded-2xl text-sm bg-white outline-none focus:ring-2 focus:ring-verde-300 resize-none">
                      </textarea>
                      <div class="sm:col-span-2">
                        <p class="text-xs font-medium text-gray-600 mb-2">Calificación</p>
                        <div class="flex gap-2">
                          @for (star of [1,2,3,4,5]; track star) {
                            <button (click)="newCata.calificacion = star" class="transition-all" [class.opacity-40]="star > newCata.calificacion">
                              <lucide-icon name="star" class="w-6 h-6 text-yellow-500" [class.fill-current]="star <= newCata.calificacion"></lucide-icon>
                            </button>
                          }
                        </div>
                      </div>
                      <div class="sm:col-span-2">
                        <button (click)="guardarCata()"
                                class="flex items-center justify-center gap-2 bg-verde-900 hover:bg-verde-800 text-white font-semibold py-3 px-6 rounded-2xl text-sm transition-all w-full sm:w-auto">
                          Guardar cata
                        </button>
                      </div>
                    </div>
                  </div>
                }

                @if (data.catas().length === 0 && !showNewCataForm()) {
                  <div class="text-center py-10">
                    <div class="mb-3 flex justify-center text-gray-400">
                      <lucide-icon name="book" class="w-12 h-12"></lucide-icon>
                    </div>
                    <p class="font-bold text-gray-900">Diario vacío</p>
                  </div>
                } @else {
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    @for (cata of data.catas(); track cata.id) {
                      <div class="bg-gray-50 rounded-2xl p-4">
                        <div class="flex items-start justify-between mb-2">
                          <div>
                            <p class="font-bold text-gray-900">{{ cata.cafeteriaNombre }}</p>
                            <p class="text-xs text-gray-500">{{ cata.fecha | date:'d MMM yyyy':'':'es' }} · {{ cata.metodo }}</p>
                          </div>
                          <div class="flex items-center">
                            @for (s of [1,2,3,4,5]; track s) {
                              <lucide-icon name="star" class="w-4 h-4 text-yellow-500" [class.fill-current]="s <= cata.calificacion" [class.opacity-30]="s > cata.calificacion"></lucide-icon>
                            }
                          </div>
                        </div>
                        <p class="text-sm text-gray-600 leading-relaxed">{{ cata.nota }}</p>
                      </div>
                    }
                  </div>
                }
              }

              <!-- INSIGNIAS TAB -->
              @if (activeTab() === 'insignias') {
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-3">
                  @for (insignia of insignias; track insignia.id) {
                    <div class="bg-gray-50 rounded-2xl p-4 text-center flex flex-col items-center gap-2"
                         [class.opacity-40]="!insignia.obtenida">
                      <div class="w-14 h-14 rounded-2xl flex items-center justify-center"
                           [class.bg-yellow-100]="insignia.obtenida"
                           [class.bg-gray-100]="!insignia.obtenida"
                           [class.text-yellow-700]="insignia.obtenida"
                           [class.text-gray-400]="!insignia.obtenida">
                        <lucide-icon [name]="insignia.icon" class="w-7 h-7"></lucide-icon>
                      </div>
                      <p class="text-xs font-bold text-gray-900 leading-tight">{{ insignia.nombre }}</p>
                      <p class="text-[10px] text-gray-500">{{ insignia.descripcion }}</p>
                      <div class="text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                            [class.bg-verde-100]="insignia.obtenida"
                            [class.text-verde-800]="insignia.obtenida"
                            [class.bg-gray-200]="!insignia.obtenida"
                            [class.text-gray-500]="!insignia.obtenida">
                        @if (insignia.obtenida) { <lucide-icon name="check" class="w-3 h-3"></lucide-icon> Obtenida }
                        @else { Bloqueada }
                      </div>
                    </div>
                  }
                </div>
              }

            </div>
          </div>

        </div>

        <!-- ─────── RIGHT SIDEBAR (xl+) ─────── -->
        <aside class="hidden xl:flex flex-col gap-5 self-start sticky top-20">

          <!-- Quick stats -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <p class="text-sm font-bold text-gray-900 mb-3">Resumen</p>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Sellos coleccionados</span>
                <span class="text-sm font-bold text-verde-900">{{ data.totalSellos() }} / 15</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Catas registradas</span>
                <span class="text-sm font-bold text-cafe-700">{{ data.catas().length }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-gray-100">
                <span class="text-sm text-gray-600">Insignias obtenidas</span>
                <span class="text-sm font-bold text-yellow-600">0 / {{ insignias.length }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-gray-600">Progreso total</span>
                <span class="text-sm font-bold text-gray-900">{{ data.progresoPorcentaje() }}%</span>
              </div>
            </div>
          </div>

          <!-- Cafeterias available -->
          <div class="bg-white rounded-3xl shadow-card p-5">
            <p class="text-sm font-bold text-gray-900 mb-3">Cafeterías disponibles</p>
            <div class="space-y-2">
              @for (cafe of data.cafeterias(); track cafe.id) {
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" [style.background-color]="cafe.color + '22'">
                    <div class="w-4 h-4 rounded-full" [style.background-color]="cafe.color"></div>
                  </div>
                  <span class="flex-1 text-sm text-gray-700 truncate">{{ cafe.nombre }}</span>
                  @if (cafe.visitada) {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1a650c" stroke-width="3" class="w-4 h-4 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  } @else {
                    <div class="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0"></div>
                  }
                </div>
              }
            </div>
          </div>

          <a routerLink="/activar"
             class="flex items-center justify-center gap-2 bg-verde-900 hover:bg-verde-800 text-white font-semibold py-4 px-6 rounded-2xl text-sm transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" class="w-4 h-4">
              <rect width="5" height="5" x="3" y="3" rx="1"/>
            </svg>
            Escanear nuevo sello
          </a>

        </aside>

      </div>
    </div>
  `,
})
export class PasaporteComponent {
  data = inject(DataService);
  activeTab = signal('sellos');
  showNewCataForm = signal(false);

  newCata = { cafeteria: '', metodo: '', nota: '', calificacion: 5 };

  tabs = [
    { id: 'sellos',   icon: 'target', label: 'Mis Sellos',       shortLabel: 'Sellos' },
    { id: 'catas',    icon: 'book', label: 'Diario de Catas',   shortLabel: 'Catas' },
    { id: 'insignias',icon: 'award', label: 'Insignias',         shortLabel: 'Insignias' },
  ];

  insignias = [
    { id: 'primera-taza', nombre: 'Primera Taza',    icon: 'coffee', descripcion: 'Tu primer sello',          obtenida: false },
    { id: 'explorador',   nombre: 'Explorador',      icon: 'map', descripcion: '5 cafeterías visitadas',   obtenida: false },
    { id: 'catador',      nombre: 'Catador',          icon: 'wind', descripcion: '1 nota en diario',         obtenida: false },
    { id: 'viajero',      nombre: 'Viajero Café',    icon: 'briefcase', descripcion: '10 cafeterías visitadas',  obtenida: false },
    { id: 'degustador',   nombre: 'Degustador',      icon: 'award', descripcion: '3 métodos diferentes',     obtenida: false },
    { id: 'completo',     nombre: 'Ruta Completa',   icon: 'sparkles', descripcion: '15 sellos obtenidos',      obtenida: false },
  ];

  getArray(n: number): number[] { return Array.from({ length: n }, (_, i) => i); }

  guardarCata(): void {
    if (!this.newCata.cafeteria || !this.newCata.metodo || !this.newCata.nota) return;
    const cafe = this.data.getCafeteria(this.newCata.cafeteria);
    if (!cafe) return;
    this.data.agregarCata({
      cafeteriaId: this.newCata.cafeteria,
      cafeteriaNombre: cafe.nombre,
      fecha: new Date(),
      nota: this.newCata.nota,
      calificacion: this.newCata.calificacion,
      metodo: this.newCata.metodo,
      sabores: [],
    });
    this.newCata = { cafeteria: '', metodo: '', nota: '', calificacion: 5 };
    this.showNewCataForm.set(false);
  }
}
