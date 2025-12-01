import { buildApiUrl } from '../conf/api.config';
import type {
    Order,
    CreateOrderRequest,
    UpdateOrderRequest,
    OrdersResponse,
    OrderFilters,
} from '../types/order.types';

// ============================================
// Servicio de Pedidos
// ============================================

class OrderService {
    /**
     * Obtener lista de pedidos con filtros
     */
    async getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.tableId) queryParams.append('tableId', filters.tableId.toString());
            if (filters?.isPaid !== undefined) queryParams.append('isPaid', filters.isPaid.toString());
            if (filters?.startDate) queryParams.append('startDate', filters.startDate);
            if (filters?.endDate) queryParams.append('endDate', filters.endDate);

            const url = `${buildApiUrl('/orders')}?${queryParams.toString()}`;
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
                throw new Error('Error al obtener pedidos');
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
     * Obtener pedido por ID
     */
    async getOrderById(id: number): Promise<Order> {
        try {
            const url = buildApiUrl(`/orders/${id}`);
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
                throw new Error('Error al obtener pedido');
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
     * Crear nuevo pedido
     * IMPORTANTE: Crea automáticamente un movimiento de ingreso en la caja activa
     */
    async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        try {
            const url = buildApiUrl('/orders');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear pedido');
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
     * Actualizar pedido
     */
    async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
        try {
            const url = buildApiUrl(`/orders/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar pedido');
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
     * Eliminar pedido (solo no pagados)
     */
    async deleteOrder(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/orders/${id}`);
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
                throw new Error(errorData.message || 'Error al eliminar pedido');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Cambiar estado del pedido
     */
    async changeStatus(id: number, newStatus: string): Promise<Order> {
        try {
            const url = buildApiUrl(`/orders/${id}/change-status`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(newStatus),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar estado del pedido');
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
     * Marcar pedido como pagado
     */
    async markAsPaid(id: number): Promise<Order> {
        try {
            const url = buildApiUrl(`/orders/${id}/mark-as-paid`);
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al marcar pedido como pagado');
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
export const orderService = new OrderService();
