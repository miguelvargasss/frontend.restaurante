// ============================================
// Tipos para Autenticación
// ============================================

/**
 * Credenciales de login
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Respuesta del servidor al hacer login
 */
export interface LoginResponse {
    token: string;
    refreshToken?: string;
    user: User;
    expiresIn?: number;
}

/**
 * Información del usuario autenticado
 */
export interface User {
    id: string | number;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    avatar?: string;
}

/**
 * Estado de autenticación en Redux
 */
export interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

/**
 * Errores de autenticación
 */
export interface AuthError {
    message: string;
    code?: string;
    field?: string;
}
