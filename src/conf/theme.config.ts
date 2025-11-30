import type { ThemeConfig } from 'antd';
import { COLORS } from '../constants/colors.constants';

// Configuración del tema personalizado de Ant Design para Doña Julia
export const themeConfig: ThemeConfig = {
    token: {
        // Colores principales
        colorPrimary: COLORS.accent,        // Cyan para botones principales
        colorError: COLORS.error,
        colorSuccess: COLORS.success,
        colorWarning: COLORS.warning,

        // Tipografía
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 14,

        // Bordes redondeados
        borderRadius: 8,

        // Colores de fondo
        colorBgContainer: '#FFFFFF',

        // Inputs
        controlHeight: 48,
        controlHeightLG: 56,
    },

    components: {
        Input: {
            colorBorder: COLORS.input.border,
            colorBgContainer: COLORS.input.background,
            activeBorderColor: COLORS.input.focus,
            hoverBorderColor: COLORS.input.focus,
            controlHeight: 48,
        },

        Button: {
            controlHeight: 48,
            controlHeightLG: 56,
            fontWeight: 600,
            primaryShadow: 'none',
        },

        Form: {
            labelColor: COLORS.text.primary,
            labelFontSize: 14,
        },
    },
};
