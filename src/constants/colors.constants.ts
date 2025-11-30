// Colores del diseño de Doña Julia extraídos de Figma
export const COLORS = {
    // Colores principales
    primary: '#B33638',        // Rojo vino principal
    primaryDark: '#250A0A',    // Marrón oscuro/negro rojizo
    accent: '#00BCD4',         // Cyan/Turquesa (botón)

    // Colores de fondo
    background: {
        gradient: 'linear-gradient(135deg, #B33638 0%, #250A0A 100%)',
        card: 'rgba(37, 10, 10, 0.85)',
        overlay: 'rgba(37, 10, 10, 0.69)',
    },

    // Colores de texto
    text: {
        primary: '#FFFFFF',
        secondary: '#E0E0E0',
        placeholder: '#999999',
    },

    // Colores de inputs
    input: {
        background: '#FFFFFF',
        border: '#E0E0E0',
        focus: '#00BCD4',
    },

    // Estados
    error: '#FF4D4F',
    success: '#52C41A',
    warning: '#FAAD14',
} as const;

export type ColorScheme = typeof COLORS;
