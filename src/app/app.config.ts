import { provideLottieOptions } from 'ngx-lottie';

export const appConfig = {
    player: () => import('lottie-web'),  // Usar importación dinámica de lottie-web
};