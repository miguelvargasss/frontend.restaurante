// Configuración de la API del backend
export const API_CONFIG = {
    // En desarrollo usa HTTPS (como tu backend en Visual Studio)
    // En producción cambia esto a tu URL de producción
    BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7166/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            ME: '/auth/me',
        },
        USERS: {
            BASE: '/users',
            BY_ID: (id: number) => `/users/${id}`,
        },
        PROFILES: {
            BASE: '/profiles',
            SIMPLE: '/profiles/simple',  // ✅ Endpoint para dropdown de perfiles
        },
    },
    TIMEOUT: 30000, // 30 segundos
} as const;

// Helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
