// ============================================
// Tipos para Reservas
// ============================================

export interface Reserve {
    id: number;
    customerName: string;
    phone: string;
    numberOfPeople: number;
    advancePayment: boolean;
    amount: number;
    reservationDate: string;
    isActive: boolean;
    tableId: number | null;
    tableName: string | null;
    workerId: number | null;
    workerName: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateReserveRequest {
    customerName: string;
    phone: string;
    numberOfPeople: number;
    advancePayment: boolean;
    amount: number;
    reservationDate: string;
    tableId?: number;
    workerId?: number;
    isActive: boolean;
}

export interface UpdateReserveRequest {
    customerName: string;
    phone: string;
    numberOfPeople: number;
    advancePayment: boolean;
    amount: number;
    reservationDate: string;
    tableId?: number;
    workerId?: number;
    isActive: boolean;
}

export interface ReservesResponse {
    reserves: Reserve[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ReserveFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}
