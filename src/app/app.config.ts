import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

import {
  LucideAngularModule,
  AlertTriangle, CheckCircle, MapPin, Calendar, Rocket, Megaphone,
  BookOpen, Coffee, CircleDot, Droplets, Award, Target, Book, Map,
  Wind, Briefcase, Sparkles, Check, Star, Home, QrCode, PenLine,
  FlaskConical, Bean, Leaf, Flame, CupSoda, UserRound, Eye, EyeOff,
  ArrowRight, LogOut, ChevronUp, Zap, CircleHelp, Square, Cake,
  Users, Plus, Trash, Power, PowerOff
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: false }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es' },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(LucideAngularModule.pick({
      AlertTriangle, CheckCircle, MapPin, Calendar, Rocket, Megaphone,
      BookOpen, Coffee, CircleDot, Droplets, Award, Target, Book, Map,
      Wind, Briefcase, Sparkles, Check, Star, Home, QrCode, PenLine,
      FlaskConical, Bean, Leaf, Flame, CupSoda, UserRound, Eye, EyeOff,
      ArrowRight, LogOut, ChevronUp, Zap, CircleHelp, Square, Cake,
      Users, Plus, Trash, Power, PowerOff
    }))
  ]
};
