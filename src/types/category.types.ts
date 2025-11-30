// ============================================
// Tipos para Categorías
// ============================================

export interface Category {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    productCount: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface CategorySimple {
    id: number;
    name: string;
    description: string | null;
}

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface UpdateCategoryRequest {
    name: string;
    description?: string;
    isActive: boolean;
}

export interface CategoriesResponse {
    categories: Category[];
    total: number;
    page: number;
    pageSize: number;
}

export interface CategoryFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
}
