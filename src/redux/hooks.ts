import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ============================================
// Hooks tipados para Redux
// ============================================

// Hook para dispatch con tipos
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook para selector con tipos
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
