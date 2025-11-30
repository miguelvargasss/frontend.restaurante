// ============================================
// Tipos para Sugerencias
// ============================================

export interface Suggestion {
    id: number;
    name: string;
    details: string;
    contactEmail: string | null;
    status: string;
    suggestionDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateSuggestionRequest {
    name: string;
    details: string;
}

export interface UpdateSuggestionRequest {
    name: string;
    details: string;
    contactEmail?: string;
    status: string;
    isActive: boolean;
}

export interface SuggestionsResponse {
    suggestions: Suggestion[];
    total: number;
    page: number;
    pageSize: number;
}

export interface SuggestionFilters {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
    status?: string;
}
