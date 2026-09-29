// src/app/services/data.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Cafeteria, Sello, CataDiario, Novedad, PuntoVenta } from '../models/cafeteria.model';

export interface UserProfile {
  codigoPasaporte: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  foto?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {

  // ─── USUARIO / PASAPORTE ACTIVO ────────────────────────────────────────────
  private readonly _usuario = signal<UserProfile | null>(
    this._loadFromStorage<UserProfile | null>('usuario', null)
  );
  readonly usuario = this._usuario.asReadonly();
  readonly isPasaporteActivo = computed(() => this._usuario() !== null);

  activarPasaporte(perfil: UserProfile): void {
    this._usuario.set(perfil);
    localStorage.setItem('usuario', JSON.stringify(perfil));
  }

  // ─── CAFETERÍAS MOCK ───────────────────────────────────────────────────────
  private readonly _cafeterias = signal<Cafeteria[]>([
    {
      id: 'el-farolito',
      nombre: 'El Farolito',
      direccion: 'Vicente Guerrero 105, El Calvario, Centro',
      descripcion: 'Una cafetería íntima con los mejores granos de especialidad de la región. Conocidos por su piloncillo y Cold Brew artesanal.',
      horario: 'Abierto hasta 09:00 PM',
      distancia: '350 m',
      calificacion: 4.8,
      abierto: true,
      lat: 18.8994,
      lng: -97.7336,
      etiquetas: ['Piloncillo', 'Cold Brew'],
      metodos: ['V60', 'Cold Brew', 'Espresso'],
      instagram: '@elfarolito.cafe',
      color: '#1a650c',
      visitada: false,
      sellosDisponibles: 3,
      imagenUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
      bebidaInsignia: 'Café de olla con piloncillo',
      bebidaTags: ['Piloncillo', 'Canela', 'Tradicional'],
      perfilOrigen: 'Cafetería de barrio a pasos del parque central. Ambiente acogedor con productos locales y recetas de tradición.',
      caracteristicas: ['Ambiente familiar'],
      certificada: true,
      totalResenas: 128,
    },
    {
      id: 'laureana-cafe',
      nombre: 'Laureana Café',
      direccion: 'Av. 2 Pte. 102, Centro',
      descripcion: 'Ambiente acogedor con terraza y vista al zócalo. Especialistas en café de lavanda y pasas.',
      horario: 'Abierto hasta 08:30 PM',
      distancia: '520 m',
      calificacion: 4.8,
      abierto: true,
      lat: 18.9010,
      lng: -97.7318,
      etiquetas: ['Lavanda', 'Pasas'],
      metodos: ['Chemex', 'Espresso', 'Aeropress'],
      instagram: '@laureanacafe',
      color: '#c06b21',
      visitada: false,
      sellosDisponibles: 2,
    },
    {
      id: 'origen-grano',
      nombre: 'Origen & Grano Roasters',
      direccion: 'Calle 3 Oriente 112, San Nicolás',
      descripcion: 'Tostadores de origen enfocados en microlotes de Oaxaca y Chiapas. Con laboratorio de catas.',
      horario: 'Abierto hasta 07:00 PM',
      distancia: '1.1 km',
      calificacion: 4.7,
      abierto: true,
      lat: 18.8978,
      lng: -97.7355,
      etiquetas: ['Microlote', 'Catas'],
      metodos: ['Chemex', 'V60', 'Sifón'],
      instagram: '@origengrano',
      color: '#7e3f1e',
      visitada: false,
      sellosDisponibles: 4,
    },
    {
      id: 'la-tertulia',
      nombre: 'La Tertulia',
      direccion: 'Portal Hidalgo 44, Zócalo',
      descripcion: 'Con más de 10 años en el zócalo de Tecamachalco. Café de olla y repostería artesanal.',
      horario: 'Abierto hasta 06:00 PM',
      distancia: '200 m',
      calificacion: 4.6,
      abierto: false,
      lat: 18.9002,
      lng: -97.7325,
      etiquetas: ['De Olla', 'Repostería'],
      metodos: ['Café de Olla', 'Prensa Francesa'],
      color: '#381a0c',
      visitada: false,
      sellosDisponibles: 2,
    },
    {
      id: 'cafeteria-botanica',
      nombre: 'Botánica Coffee',
      direccion: 'Av. Juárez 89, Col. Centro',
      descripcion: 'Inspirada en la naturaleza, con jardín interior. Especialistas en café frío con infusiones botánicas.',
      horario: 'Abierto hasta 08:00 PM',
      distancia: '780 m',
      calificacion: 4.9,
      abierto: true,
      lat: 18.8965,
      lng: -97.7342,
      etiquetas: ['Botánico', 'Frío'],
      metodos: ['Cold Brew', 'Nitro', 'Aeropress'],
      color: '#2d9e2f',
      visitada: false,
      sellosDisponibles: 5,
    },
  ]);

  readonly cafeterias = this._cafeterias.asReadonly();

  readonly totalCafeterias = computed(() => this._cafeterias().length);
  readonly cafeteriasAbiertas = computed(() =>
    this._cafeterias().filter(c => c.abierto).length
  );

  // ─── PASAPORTE & SELLOS ────────────────────────────────────────────────────
  private readonly _sellos = signal<Sello[]>(
    this._loadFromStorage<Sello[]>('sellos', [])
  );

  readonly sellos = this._sellos.asReadonly();
  readonly totalSellos = computed(() => this._sellos().length);
  readonly progresoPorcentaje = computed(() =>
    Math.round((this._sellos().length / 15) * 100)
  );

  // ─── DIARIO DE CATAS ───────────────────────────────────────────────────────
  private readonly _catas = signal<CataDiario[]>(
    this._loadFromStorage<CataDiario[]>('catas', [])
  );
  readonly catas = this._catas.asReadonly();

  // ─── NOVEDADES ─────────────────────────────────────────────────────────────
  private readonly _novedades = signal<Novedad[]>([
    {
      id: 'nov-1',
      titulo: 'Nuevo método: Sifón japonés',
      descripcion: 'El Farolito estrena el método de sifón japonés. Un espectáculo visual y gustativo único en Tecamachalco.',
      fecha: new Date('2026-09-25'),
      tipo: 'lanzamiento',
      cafeteria: 'El Farolito',
    },
    {
      id: 'nov-2',
      titulo: 'Festival del Café 2026',
      descripcion: 'El 15 de octubre se celebra la 3ª edición del Festival del Café en el Zócalo. Entrada libre con tu pasaporte activo.',
      fecha: new Date('2026-09-20'),
      tipo: 'evento',
    },
    {
      id: 'nov-3',
      titulo: 'Nueva cafetería: Botánica Coffee',
      descripcion: 'Damos la bienvenida a Botánica Coffee a la ruta oficial. 5 sellos únicos disponibles desde ya.',
      fecha: new Date('2026-09-15'),
      tipo: 'novedad',
      cafeteria: 'Botánica Coffee',
    },
    {
      id: 'nov-4',
      titulo: 'Microlote Oaxaca llega a Origen & Grano',
      descripcion: 'Una remesa exclusiva de 50kg del micro-lote Sierra Juárez está disponible en Origen & Grano Roasters.',
      fecha: new Date('2026-09-10'),
      tipo: 'lanzamiento',
      cafeteria: 'Origen & Grano Roasters',
    },
  ]);
  readonly novedades = this._novedades.asReadonly();

  // ─── PUNTOS DE VENTA ───────────────────────────────────────────────────────
  readonly puntosVenta: PuntoVenta[] = [
    {
      id: 'finca-reserva',
      nombre: 'Finca La Reserva (Caja Principal)',
      direccion: 'Av. Juárez 402, Centro',
      disponibles: 34,
    },
    {
      id: 'origen-grano-venta',
      nombre: 'Origen & Grano Roasters',
      direccion: 'Calle 3 Oriente 112, San Nicolás',
      disponibles: 18,
    },
    {
      id: 'oficina-turismo',
      nombre: 'Oficina de Turismo Municipal',
      direccion: 'Plaza de Armas S/N, Presidencia',
      disponibles: 0,
      proxima: true,
    },
  ];

  // ─── MÉTODOS ───────────────────────────────────────────────────────────────
  getCafeteria(id: string): Cafeteria | undefined {
    return this._cafeterias().find(c => c.id === id);
  }

  agregarSello(cafeteriaId: string): void {
    const cafe = this.getCafeteria(cafeteriaId);
    if (!cafe) return;

    const nuevoSello: Sello = {
      id: `sello-${Date.now()}`,
      cafeteriaId,
      cafeteriaNombre: cafe.nombre,
      fecha: new Date(),
    };

    this._sellos.update(s => {
      const updated = [...s, nuevoSello];
      localStorage.setItem('sellos', JSON.stringify(updated));
      return updated;
    });

    // Marcar cafetería como visitada
    this._cafeterias.update(cafes =>
      cafes.map(c => c.id === cafeteriaId ? { ...c, visitada: true } : c)
    );
  }

  agregarCata(cata: Omit<CataDiario, 'id'>): void {
    const nuevaCata: CataDiario = {
      ...cata,
      id: `cata-${Date.now()}`,
    };
    this._catas.update(c => {
      const updated = [...c, nuevaCata];
      localStorage.setItem('catas', JSON.stringify(updated));
      return updated;
    });
  }

  limpiarRegistros(): void {
    this._sellos.set([]);
    this._catas.set([]);
    localStorage.removeItem('sellos');
    localStorage.removeItem('catas');
    this._cafeterias.update(cafes => cafes.map(c => ({ ...c, visitada: false })));
  }

  factoryReset(): void {
    localStorage.clear();
    window.location.href = '/';
  }

  private _loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}
