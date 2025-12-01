import { buildApiUrl } from '../conf/api.config';
import type {
    Worker,
    CreateWorkerRequest,
    UpdateWorkerRequest,
    WorkersResponse,
    WorkerFilters,
} from '../types/worker.types';

// ============================================
// Servicio de Trabajadores
// ============================================

class WorkerService {
    /**
     * Obtener lista de trabajadores con filtros
     */
    async getWorkers(filters?: WorkerFilters): Promise<WorkersResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

            const url = `${buildApiUrl('/workers')}?${queryParams.toString()}`;
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
                throw new Error('Error al obtener trabajadores');
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
     * Obtener trabajador por ID
     */
    async getWorkerById(id: number): Promise<Worker> {
        try {
            const url = buildApiUrl(`/workers/${id}`);
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
                throw new Error('Error al obtener trabajador');
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
     * Crear nuevo trabajador
     */
    async createWorker(workerData: CreateWorkerRequest): Promise<Worker> {
        try {
            const url = buildApiUrl('/workers');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(workerData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear trabajador');
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
     * Actualizar trabajador
     */
    async updateWorker(id: number, workerData: UpdateWorkerRequest): Promise<Worker> {
        try {
            const url = buildApiUrl(`/workers/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(workerData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar trabajador');
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
     * Eliminar trabajador
     */
    async deleteWorker(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/workers/${id}`);
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
                throw new Error(errorData.message || 'Error al eliminar trabajador');
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
export const workerService = new WorkerService();
