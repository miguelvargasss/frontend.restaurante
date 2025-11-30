import { API_CONFIG } from '../conf/api.config';

// ============================================
// Utilidad para peticiones HTTP
// ============================================

interface FetchOptions extends RequestInit {
    timeout?: number;
}

/**
 * Wrapper de fetch con timeout y manejo de errores mejorado
 */
export async function fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
): Promise<Response> {
    const { timeout = API_CONFIG.TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición tardó demasiado tiempo');
            }
            throw error;
        }
        throw new Error('Error de red desconocido');
    }
}

/**
 * Headers por defecto para las peticiones
 */
export const getDefaultHeaders = (): HeadersInit => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
});

/**
 * Headers con autenticación
 */
export const getAuthHeaders = (token: string | null): HeadersInit => ({
    ...getDefaultHeaders(),
    ...(token && { 'Authorization': `Bearer ${token}` }),
});
