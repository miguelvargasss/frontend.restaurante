import { buildApiUrl } from '../conf/api.config';
import type {
    SmallBox,
    CreateSmallBoxRequest,
    CloseSmallBoxRequest,
    CreateCashMovementRequest,
    SmallBoxesResponse,
    SmallBoxFilters,
    CashMovement,
} from '../types/smallBox.types';

// ============================================
// Servicio de Caja Chica
// ============================================

class SmallBoxService {
    /**
     * Obtener lista de cajas con filtros
     */
    async getSmallBoxes(filters?: SmallBoxFilters): Promise<SmallBoxesResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
            if (filters?.isClosed !== undefined) queryParams.append('isClosed', filters.isClosed.toString());
            if (filters?.startDate) queryParams.append('startDate', filters.startDate);
            if (filters?.endDate) queryParams.append('endDate', filters.endDate);

            const url = `${buildApiUrl('/smallbox')}?${queryParams.toString()}`;
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
                throw new Error('Error al obtener cajas');
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
     * Obtener caja por ID
     */
    async getSmallBoxById(id: number): Promise<SmallBox> {
        try {
            const url = buildApiUrl(`/smallbox/${id}`);
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
                throw new Error('Error al obtener caja');
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
     * Obtener caja activa (abierta)
     * Retorna null si no hay caja activa
     */
    async getActiveSmallBox(): Promise<SmallBox | null> {
        try {
            const url = buildApiUrl('/smallbox/active');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (response.status === 404) {
                return null;
            }

            if (!response.ok) {
                throw new Error('Error al obtener caja activa');
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
     * Abrir nueva caja
     */
    async openSmallBox(data: CreateSmallBoxRequest): Promise<SmallBox> {
        try {
            const url = buildApiUrl('/smallbox');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al abrir caja');
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
     * Cerrar caja
     */
    async closeSmallBox(id: number, data: CloseSmallBoxRequest): Promise<SmallBox> {
        try {
            const url = buildApiUrl(`/smallbox/${id}/close`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al cerrar caja');
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
     * Registrar movimiento de caja (ingreso o egreso manual)
     */
    async addCashMovement(data: CreateCashMovementRequest): Promise<CashMovement> {
        try {
            const url = buildApiUrl('/smallbox/cash-movement');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al registrar movimiento');
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
     * Eliminar caja (solo cerradas)
     */
    async deleteSmallBox(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/smallbox/${id}`);
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
                throw new Error(errorData.message || 'Error al eliminar caja');
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
export const smallBoxService = new SmallBoxService();
