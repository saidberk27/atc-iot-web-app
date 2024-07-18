import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const authGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);

    try {
        await getCurrentUser();
        return true;
    } catch {
        router.navigate(['/']);
        return false;
    }
};