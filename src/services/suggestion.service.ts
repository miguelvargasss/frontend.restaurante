import { buildApiUrl } from '../conf/api.config';
import type {
    Suggestion,
    CreateSuggestionRequest,
    UpdateSuggestionRequest,
    SuggestionsResponse,
    SuggestionFilters,
} from '../types/suggestion.types';

// ============================================
// Servicio de Sugerencias
// ============================================

class SuggestionService {
    /**
     * Obtener lista de sugerencias con filtros
     */
    async getSuggestions(filters?: SuggestionFilters): Promise<SuggestionsResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

            const url = `${buildApiUrl('/suggestions')}?${queryParams.toString()}`;
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
                throw new Error('Error al obtener sugerencias');
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
     * Obtener sugerencia por ID
     */
    async getSuggestionById(id: number): Promise<Suggestion> {
        try {
            const url = buildApiUrl(`/suggestions/${id}`);
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
                throw new Error('Error al obtener sugerencia');
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
     * Crear nueva sugerencia
     */
    async createSuggestion(suggestionData: CreateSuggestionRequest): Promise<Suggestion> {
        try {
            const url = buildApiUrl('/suggestions');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(suggestionData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear sugerencia');
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
     * Actualizar sugerencia
     */
    async updateSuggestion(id: number, suggestionData: UpdateSuggestionRequest): Promise<Suggestion> {
        try {
            const url = buildApiUrl(`/suggestions/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(suggestionData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar sugerencia');
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
     * Eliminar sugerencia
     */
    async deleteSuggestion(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/suggestions/${id}`);
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
                throw new Error(errorData.message || 'Error al eliminar sugerencia');
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
export const suggestionService = new SuggestionService();
