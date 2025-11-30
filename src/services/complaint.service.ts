import { buildApiUrl } from '../conf/api.config';
import type {
    Complaint,
    CreateComplaintRequest,
    UpdateComplaintRequest,
    ComplaintsResponse,
    ComplaintFilters,
} from '../types/complaint.types';

// ============================================
// Servicio de Reclamos (Claims)
// ============================================

class ComplaintService {
    /**
     * Obtener lista de reclamos con filtros
     */
    async getComplaints(filters?: ComplaintFilters): Promise<ComplaintsResponse> {
        try {
            const queryParams = new URLSearchParams();

            if (filters?.search) queryParams.append('search', filters.search);
            if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
            if (filters?.status) queryParams.append('status', filters.status);
            if (filters?.page) queryParams.append('page', filters.page.toString());
            if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

            const url = `${buildApiUrl('/claims')}?${queryParams.toString()}`;
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener reclamos');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Obtener reclamo por ID
     */
    async getComplaintById(id: number): Promise<Complaint> {
        try {
            const url = buildApiUrl(`/claims/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener reclamo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Crear nuevo reclamo
     */
    async createComplaint(complaintData: CreateComplaintRequest): Promise<Complaint> {
        try {
            const url = buildApiUrl('/claims');
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(complaintData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al crear reclamo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Actualizar reclamo
     */
    async updateComplaint(id: number, complaintData: UpdateComplaintRequest): Promise<Complaint> {
        try {
            const url = buildApiUrl(`/claims/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify(complaintData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar reclamo');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }

    /**
     * Eliminar reclamo
     */
    async deleteComplaint(id: number): Promise<void> {
        try {
            const url = buildApiUrl(`/claims/${id}`);
            const token = localStorage.getItem('auth_token');

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al eliminar reclamo');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error de conexión con el servidor');
        }
    }
}

// Exportar instancia única del servicio
export const complaintService = new ComplaintService();
