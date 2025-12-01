// ============================================
// Tipos para Ambientes/Salones (Lounges)
// ============================================

export interface Lounge {
    id: number;
    Name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateLoungeRequest {
    Name: string;
    isActive: boolean;
}

export interface UpdateLoungeRequest {
    Name: string;
    isActive: boolean;
}

export interface LoungesResponse {
    lounges: Lounge[];
    total: number;
    page: number;
    pageSize: number;
}

export interface LoungeFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
}
