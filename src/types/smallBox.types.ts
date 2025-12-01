// ============================================
// Tipos para Caja Chica (SmallBox)
// ============================================

export interface CashMovement {
    id: number;
    movementType: 'Ingreso' | 'Egreso';
    amount: number;
    concept: string;
    movementDate: string;
}

export interface SmallBox {
    id: number;
    initialAmount: number;
    finalAmount: number | null;
    openingDate: string;
    closingDate: string | null;
    additionalNote: string | null;
    isClosed: boolean;
    userId: number;
    userName: string | null;
    totalIncome: number;
    totalExpense: number;
    currentBalance: number;
    cashMovements: CashMovement[];
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateSmallBoxRequest {
    initialAmount: number;
    additionalNote?: string;
}

export interface CloseSmallBoxRequest {
    finalAmount: number;
    additionalNote?: string;
}

export interface CreateCashMovementRequest {
    movementType: 'Ingreso' | 'Egreso';
    amount: number;
    concept: string;
    smallBoxId: number;
}

export interface SmallBoxesResponse {
    smallBoxes: SmallBox[];
    total: number;
    page: number;
    pageSize: number;
}

export interface SmallBoxFilters {
    page?: number;
    pageSize?: number;
    isClosed?: boolean;
    startDate?: string;
    endDate?: string;
}
