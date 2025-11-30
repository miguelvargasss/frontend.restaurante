import { buildApiUrl } from '../conf/api.config';
import type {
    Category,
    CategorySimple,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    CategoriesResponse,
    CategoryFilters,
} from '../types/category.types';

// ============================================
// Servicio de Categorías
// ============================================

class CategoryService {
    /**
     * Obtener lista de categorías con filtros
     */
    async getCategories(filters?: CategoryFilters): Promise<CategoriesResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

            const url = `${buildApiUrl('/categories')}?${queryParams.toString()}`;
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
                throw new Error('Error al obtener categorías');
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
     * Obtener lista simplificada de categorías activas (para dropdowns)
     */
    async getCategoriesSimple(): Promise<CategorySimple[]> {
        try {
            const url = buildApiUrl('/categories/simple');
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
                throw new Error('Error al obtener categorías');
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
     * Obtener categoría por ID
     */
    async getCategoryById(id: number): Promise<Category> {
        try {
            const url = buildApiUrl(`/categories/${id}`);
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
                throw new Error('Error al obtener categoría');
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
     * Crear nueva categoría
     */
    async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
        try {
            const url = buildApiUrl('/categories');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear categoría');
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
     * Actualizar categoría
     */
    async updateCategory(id: number, categoryData: UpdateCategoryRequest): Promise<Category> {
        try {
            const url = buildApiUrl(`/categories/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar categoría');
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
     * Eliminar categoría
     */
    async deleteCategory(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/categories/${id}`);
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
                throw new Error(errorData.message || 'Error al eliminar categoría');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Activar/Desactivar categoría
     */
    async toggleCategoryStatus(id: number): Promise<Category> {
        try {
            const url = buildApiUrl(`/categories/${id}/toggle-status`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al cambiar estado de categoría');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }
}

// Exportar instancia única del servicio
export const categoryService = new CategoryService();
