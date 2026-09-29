import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.user()?.role;
  if (role === 'SUPER_ADMIN' || role === 'CAFE_ADMIN') return true;
  router.navigate(['/']);
  return false;
};
