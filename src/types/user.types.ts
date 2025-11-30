// ============================================
// Tipos para Gestión de Usuarios
// ============================================

/**
 * Usuario en el sistema
 */
export interface User {
    id: number;
    email: string;
    name: string;              // ✅ Nombre completo o nombre
    lastName?: string;         // ✅ Apellido (opcional en respuesta)
    isActive: boolean;
    profileId: number;
    profileName: string;
    createdAt?: string;
    lastLogin?: string;
}

/**
 * Perfil de usuario
 */
export interface Profile {
    id: number;
    name: string;
    description?: string;
}

/**
 * Datos para crear usuario
 */
export interface CreateUserRequest {
    email: string;
    password: string;
    name: string;
    lastName: string;
    profileId: number;
    isActive: boolean;
}

/**
 * Datos para actualizar usuario
 */
export interface UpdateUserRequest {
    email?: string;
    name?: string;             // ✅ Nombre (consistente con backend)
    lastName?: string;
    profileId?: number;
    isActive?: boolean;
}

/**
 * Respuesta paginada de usuarios
 */
export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * Filtros de búsqueda
 */
export interface UserFilters {
    search?: string;
    profileId?: number;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
}
