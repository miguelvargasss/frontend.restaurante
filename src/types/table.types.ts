// ============================================
// Tipos para Mesas
// ============================================

export interface Table {
    id: number;
    name: string;
    environment: string;
    capacity: number;
    isActive: boolean;
    loungeId: number | null;
    loungeName: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface TableSimple {
    id: number;
    name: string;
    capacity: number;
    environment: string;
}

export interface CreateTableRequest {
    name: string;
    environment: string;
    capacity: number;
    loungeId?: number;
    isActive: boolean;
}

export interface UpdateTableRequest {
    name: string;
    environment: string;
    capacity: number;
    loungeId?: number;
    isActive: boolean;
}

export interface TablesResponse {
    tables: Table[];
    total: number;
    page: number;
    pageSize: number;
}

export interface TableFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    loungeId?: number;
}
