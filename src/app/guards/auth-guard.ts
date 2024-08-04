import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

export const authGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);

    try {
        await getCurrentUser();

        // Rol kontrolü gerekiyorsa
        if (route.data && route.data['allowedRoles']) {
            const userAttributes = await fetchUserAttributes();
            const userRole = userAttributes['custom:role'];

            if (!userRole) {
                console.error('User role not found');
                router.navigate(['/unauthorized']);
                return false;
            }

            const allowedRoles = route.data['allowedRoles'] as string[];

            if (!allowedRoles.includes(userRole)) {
                console.error('User does not have the required role');
                router.navigate(['/unauthorized']);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error('Authentication error:', error);
        router.navigate(['/login']);
        return false;
    }
};