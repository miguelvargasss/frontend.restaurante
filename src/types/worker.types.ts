// ============================================
// Tipos para Trabajadores
// ============================================

export interface Worker {
    id: number;
    name: string;
    lastName: string;
    dni: number;
    phone: string;
    email: string | null;
    salary: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateWorkerRequest {
    name: string;
    lastName: string;
    dni: number;
    phone: string;
    email?: string;
    salary: number;
}

export interface UpdateWorkerRequest {
    name: string;
    lastName: string;
    dni: number;
    phone: string;
    email?: string;
    salary: number;
}

export interface WorkersResponse {
    workers: Worker[];
    total: number;
    page: number;
    pageSize: number;
}

export interface WorkerFilters {
    page?: number;
    pageSize?: number;
    search?: string;
}
