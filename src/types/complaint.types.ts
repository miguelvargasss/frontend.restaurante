// ============================================
// Tipos para Reclamos (Claims)
// ============================================

export interface Complaint {
    id: number;
    name: string;
    detail: string;
    contactEmail: string | null;
    contactPhone: string | null;
    status: string;
    claimDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateComplaintRequest {
    name: string;
    detail: string;
}

export interface UpdateComplaintRequest {
    name: string;
    detail: string;
    contactEmail?: string;
    contactPhone?: string;
    status: string;
    isActive: boolean;
}

export interface ComplaintsResponse {
    claims: Complaint[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ComplaintFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    status?: string;
}
