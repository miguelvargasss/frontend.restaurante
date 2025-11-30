// ============================================
// Tipos para Gestión de Perfiles y Permisos
// ============================================

/**
 * Permiso individual (Ver, Editar, Eliminar)
 */
export interface Permission {
    view: boolean;
    edit: boolean;
    delete: boolean;
}

/**
 * Componentes específicos de un módulo
 */
export interface ModuleComponent {
    name: string;
    enabled: boolean;
}

/**
 * Módulo con sus permisos y componentes
 */
export interface Module {
    id: string;
    name: string;
    displayName: string;
    permissions: Permission;
    components: ModuleComponent[];
}

/**
 * Perfil completo con todos sus módulos
 */
export interface ProfileWithPermissions {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    hasAdminAccess?: boolean;  // ✅ Acceso de administrador
    isActive?: boolean;         // ✅ Estado activo/inactivo
    modules: Module[];
}

/**
 * Datos para crear perfil
 */
export interface CreateProfileRequest {
    name: string;
    description: string;
    modules: Module[];
}

/**
 * Datos para actualizar perfil
 */
export interface UpdateProfileRequest {
    name?: string;
    description?: string;
    hasAdminAccess?: boolean;  // ✅ Acceso de administrador
    isActive?: boolean;         // ✅ Estado activo/inactivo
}

/**
 * Perfil simple (para listas)
 */
export interface ProfileListItem {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    hasAdminAccess?: boolean;  // ✅ Acceso de administrador
    isActive?: boolean;         // ✅ Estado activo/inactivo
}

/**
 * Respuesta paginada de perfiles
 */
export interface ProfilesResponse {
    profiles: ProfileListItem[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * Filtros de búsqueda para perfiles
 */
export interface ProfileFilters {
    search?: string;
    page?: number;
    pageSize?: number;
}
