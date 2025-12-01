import { buildApiUrl } from '../conf/api.config';
import type {
    Lounge,
    CreateLoungeRequest,
    UpdateLoungeRequest,
    LoungesResponse,
    LoungeFilters,
} from '../types/lounge.types';

// ============================================
// Servicio de Ambientes/Salones
// ============================================

class LoungeService {
    /**
     * Obtener lista de ambientes con filtros
     */
    async getLounges(filters?: LoungeFilters): Promise<LoungesResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());

            const url = `${buildApiUrl('/lounges')}?${queryParams.toString()}`;
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener ambientes');
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
     * Obtener ambiente por ID
     */
    async getLoungeById(id: number): Promise<Lounge> {
        try {
            const url = buildApiUrl(`/lounges/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener ambiente');
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
     * Crear nuevo ambiente
     */
    async createLounge(loungeData: CreateLoungeRequest): Promise<Lounge> {
        try {
            const url = buildApiUrl('/lounges');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(loungeData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear ambiente');
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
     * Actualizar ambiente
     */
    async updateLounge(id: number, loungeData: UpdateLoungeRequest): Promise<Lounge> {
        try {
            const url = buildApiUrl(`/lounges/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(loungeData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar ambiente');
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
     * Eliminar ambiente
     */
    async deleteLounge(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/lounges/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar ambiente');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }
}

// Exportar instancia única del servicio
export const loungeService = new LoungeService();
