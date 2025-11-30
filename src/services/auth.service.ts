import { API_CONFIG, buildApiUrl } from '../conf/api.config';
import type { LoginRequest, LoginResponse, User } from '../types/auth.types';

// ============================================
// Servicio de Autenticación
// ============================================

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'user_data';

    /**
     * Realizar login con email y contraseña
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Importante para CORS con cookies
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data: LoginResponse = await response.json();

            // Guardar tokens y usuario en localStorage
            this.setToken(data.token);
            if (data.refreshToken) {
                this.setRefreshToken(data.refreshToken);
            }
            this.setUser(data.user);

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Cerrar sesión
     */
    async logout(): Promise<void> {
        try {
            const token = this.getToken();

            if (token) {
                // Opcional: llamar al endpoint de logout en el backend
                await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGOUT), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }).catch(() => {
                    // Ignorar errores del logout en el backend
                });
            }
        } finally {
            // Siempre limpiar el localStorage
            this.clearAuth();
        }
    }

    /**
     * Obtener usuario actual desde localStorage
     */
    getCurrentUser(): User | null {
        const userData = localStorage.getItem(this.USER_KEY);
        if (!userData) return null;

        try {
            return JSON.parse(userData);
        } catch {
            return null;
        }
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    /**
     * Obtener token de autenticación
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Obtener refresh token
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Guardar token
     */
    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Guardar refresh token
     */
    private setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    /**
     * Guardar información del usuario
     */
    private setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    /**
     * Limpiar toda la información de autenticación
     */
    private clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    /**
     * Obtener headers con autenticación
     */
    getAuthHeaders(): HeadersInit {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    }
}

// Exportar instancia única del servicio
export const authService = new AuthService();
