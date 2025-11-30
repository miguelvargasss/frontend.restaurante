import { buildApiUrl } from '../conf/api.config';
import type { User, CreateUserRequest, UpdateUserRequest, UsersResponse, UserFilters, Profile } from '../types/user.types';

// ============================================
// Servicio de Usuarios
// ============================================

class UserService {
    /**
     * Obtener lista de usuarios con filtros
     */
    async getUsers(filters?: UserFilters): Promise<UsersResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.profileId) queryParams.append('profileId', filters.profileId.toString());
            if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

            const url = `${buildApiUrl('/users')}?${queryParams.toString()}`;
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Obtener usuario por ID
     */
    async getUserById(id: number): Promise<User> {
        try {
            const url = buildApiUrl(`/users/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener usuario');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Crear nuevo usuario
     */
    async createUser(userData: CreateUserRequest): Promise<User> {
        try {
            const url = buildApiUrl('/users');
            const token = localStorage.getItem('auth_token');

            console.log('🌐 Llamando a API:', url);
            console.log('🔑 Token presente:', !!token);
            console.log('📦 Body enviado:', JSON.stringify(userData, null, 2));

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            console.log('📡 Status de respuesta:', response.status, response.statusText);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Error del backend:', errorData);
                throw new Error(errorData.message || 'Error al crear usuario');
            }

            const result = await response.json();
            console.log('✅ Usuario creado exitosamente:', result);
            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Actualizar usuario
     */
    async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
        try {
            const url = buildApiUrl(`/users/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar usuario');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Eliminar usuario
     */
    async deleteUser(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/users/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar usuario');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Obtener lista de perfiles disponibles (versión simple para dropdowns)
     */
    async getProfiles(): Promise<Profile[]> {
        try {
            const url = buildApiUrl('/profiles/simple');  // ✅ Endpoint correcto
            const token = localStorage.getItem('auth_token');

            console.log('🔍 Cargando perfiles desde:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('❌ Error al obtener perfiles:', response.status, response.statusText);
                throw new Error('Error al obtener perfiles');
            }

            const data = await response.json();
            console.log('✅ Perfiles recibidos:', data);

            // El backend retorna un array directo: [{ id, name, description }, ...]
            if (Array.isArray(data)) {
                return data;
            }

            // Fallback: si retorna un objeto con propiedad 'profiles'
            if (data.profiles && Array.isArray(data.profiles)) {
                return data.profiles;
            }

            console.warn('⚠️ Formato de respuesta inesperado:', data);
            return [];
        } catch (error) {
            console.error('❌ Error en getProfiles:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }
}

// Exportar instancia única del servicio
export const userService = new UserService();
