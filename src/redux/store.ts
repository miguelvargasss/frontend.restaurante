import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// ============================================
// Configuración del Store de Redux
// ============================================

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Aquí se pueden agregar más reducers en el futuro
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignorar estas rutas en la verificación de serialización
                ignoredActions: ['auth/login/fulfilled'],
            },
        }),
});

// ============================================
// Tipos para TypeScript
// ============================================

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
