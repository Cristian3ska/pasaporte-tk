// src/app/models/cafeteria.model.ts

export interface Cafeteria {
  id: string;
  nombre: string;
  direccion: string;
  descripcion: string;
  horario: string;
  distancia?: string;
  calificacion: number;
  abierto: boolean;
  lat: number;
  lng: number;
  etiquetas: string[];
  metodos: string[];
  telefono?: string;
  instagram?: string;
  color: string;
  visitada?: boolean;
  sellosDisponibles?: number;
  imagenUrl?: string;
  bebidaInsignia?: string;
  bebidaTags?: string[];
  perfilOrigen?: string;
  caracteristicas?: string[];
  certificada?: boolean;
  totalResenas?: number;
}

export interface Sello {
  id: string;
  cafeteriaId: string;
  cafeteriaNombre: string;
  fecha: Date;
  nota?: string;
  calificacion?: number;
  metodo?: string;
}

export interface CataDiario {
  id: string;
  cafeteriaId: string;
  cafeteriaNombre: string;
  fecha: Date;
  nota: string;
  calificacion: number;
  metodo: string;
  sabores: string[];
}

export interface Novedad {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipo: 'evento' | 'lanzamiento' | 'novedad';
  imagen?: string;
  cafeteria?: string;
}

export interface PuntoVenta {
  id: string;
  nombre: string;
  direccion: string;
  disponibles: number;
  proxima?: boolean;
}
