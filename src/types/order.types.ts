// ============================================
// Tipos para Pedidos (Orders)
// ============================================

export interface OrderDetail {
    id?: number;
    productId?: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    total: number;
    observations?: string;
    status?: string;
}

export interface Order {
    id: number;
    orderNumber: string;
    orderDate: string;
    status: 'Pendiente' | 'En Proceso' | 'Completada' | 'Cancelada';
    userId: number;
    tableId: number;
    tableName: string | null;
    workerId: number | null;
    workerName: string | null;
    paymentMethodId: number;
    paymentMethodName: string | null;
    subTotal: number;
    discount: number;
    tax: number;
    total: number;
    customerName: string | null;
    orderType: string | null;
    observations: string | null;
    isPaid: boolean;
    completedAt: string | null;
    orderDetails: OrderDetail[];
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateOrderRequest {
    tableId: number;
    workerId?: number;
    paymentMethodId: number;
    customerName?: string;
    orderType?: string;
    observations?: string;
    discount?: number;
    tax?: number;
    orderDetails: OrderDetail[];
}

export interface UpdateOrderRequest {
    tableId: number;
    workerId?: number;
    paymentMethodId: number;
    status: string;
    customerName?: string;
    orderType?: string;
    observations?: string;
    discount?: number;
    tax?: number;
    isPaid: boolean;
}

export interface OrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
}

export interface OrderFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    tableId?: number;
    isPaid?: boolean;
    startDate?: string;
    endDate?: string;
}
