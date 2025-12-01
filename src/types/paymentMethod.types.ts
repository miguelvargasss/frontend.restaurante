// ============================================
// Tipos para Métodos de Pago
// ============================================

export interface PaymentMethod {
    id: number;
    name: string;
    description: string | null;
    requiresAuthorization: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface PaymentMethodsResponse {
    paymentMethods: PaymentMethod[];
    total: number;
    page: number;
    pageSize: number;
}
