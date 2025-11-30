// ============================================
// Tipos para Productos
// ============================================

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    imageUrl: string | null;
    isActive: boolean;
    categoryId: number;
    categoryName: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateProductRequest {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    categoryId: number;
    isActive: boolean;
}

export interface UpdateProductRequest {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    categoryId: number;
    isActive: boolean;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ProductFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    categoryId?: number;
}
