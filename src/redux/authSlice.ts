import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginRequest, LoginResponse } from '../types/auth.types';
import { authService } from '../services/auth.service';

// ============================================
// Estado inicial
// ============================================

const initialState: AuthState = {
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    refreshToken: authService.getRefreshToken(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,
};

// ============================================
// Async Thunks
// ============================================

/**
 * Thunk para realizar login
 */
export const loginAsync = createAsyncThunk<
    LoginResponse,
    LoginRequest,
    { rejectValue: string }
>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Error desconocido al iniciar sesión');
        }
    }
);

/**
 * Thunk para realizar logout
 */
export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async () => {
        await authService.logout();
    }
);

// ============================================
// Slice
// ============================================

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Limpiar errores
        clearError: (state) => {
            state.error = null;
        },

        // Actualizar usuario
        updateUser: (state, action: PayloadAction<AuthState['user']>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem('user_data', JSON.stringify(action.payload));
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || null;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = action.payload || 'Error al iniciar sesión';
            });

        // Logout
        builder
            .addCase(logoutAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = null;
            });
    },
});

// ============================================
// Actions
// ============================================

export const { clearError, updateUser } = authSlice.actions;

// ============================================
// Selectors
// ============================================

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;

// ============================================
// Reducer
// ============================================

export default authSlice.reducer;
