import { buildApiUrl } from '../conf/api.config';
import type {
    PaymentMethod,
    PaymentMethodsResponse,
} from '../types/paymentMethod.types';

// ============================================
// Servicio de Métodos de Pago
// ============================================

class PaymentMethodService {
    /**
     * Obtener todos los métodos de pago (sin autenticación requerida)
     */
    async getAll(): Promise<PaymentMethod[]> {
        try {
            const url = `${buildApiUrl('/paymentmethods')}?pageSize=100`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener métodos de pago');
            }

            const data: PaymentMethodsResponse = await response.json();
            return data.paymentMethods;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Obtener método de pago por ID
     */
    async getById(id: number): Promise<PaymentMethod> {
        try {
            const url = buildApiUrl(`/paymentmethods/${id}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Método de pago no encontrado');
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
export const paymentMethodService = new PaymentMethodService();
