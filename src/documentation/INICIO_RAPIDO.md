# 🚀 Guía rápida de inicio

## Estructura completada ✅

Se ha creado toda la estructura del sistema de restaurante con los siguientes módulos:

### 📋 Módulos disponibles

1. **Dashboard** - Panel principal con estadísticas
2. **Configuración** (Usuarios, Perfiles, Empresa)
3. **Caja** - Gestión de caja
4. **Trabajadores** - Gestión de personal
5. **Reportes** (Gestión de Cajas, Ventas, Pedidos)
6. **Registros** (Carta, Reservas, Sugerencias/Reclamos, Mesas)
7. **Pedidos** - Gestión de pedidos

## 🎯 Estado actual

- ✅ **Dashboard**: Implementado con estadísticas básicas
- ⚠️ **Resto de módulos**: Muestran página 404 temporal (en desarrollo)

## 🔐 Cómo probar

1. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

2. **Navega a:** `http://localhost:5173`

3. **Inicia sesión** con las credenciales configuradas en tu backend C#

4. **Explora el sistema:**
   - Haz clic en cualquier opción del menú lateral
   - El sidebar es colapsable (usa el botón de arriba)
   - Todos los módulos excepto Dashboard muestran "404 - En desarrollo"

## 📱 Características

### Sidebar

- Menú colapsable
- Iconos para cada módulo
- Indicador de ruta activa
- Submenús organizados

### Header

- Botón para colapsar/expandir sidebar
- Notificaciones (badge con 11)
- Menú de usuario con:
  - Mi Perfil
  - Configuración
  - Cerrar Sesión

## 🛠️ Próximos pasos

Para implementar un módulo específico (ej: Usuarios):

1. Reemplaza el contenido de `src/pages/configuracion/UsuariosPage.tsx`
2. Crea los servicios API necesarios en `src/services/`
3. Define los tipos en `src/types/`
4. Conecta con tu backend C#

## 📄 Documentación adicional

- `ESTRUCTURA.md` - Estructura completa del proyecto
- `CONFIGURATION.md` - Configuración de API y variables de entorno

## ✨ Tecnologías utilizadas

- React 18 + TypeScript
- React Router v6 (navegación)
- Redux Toolkit (estado global)
- Ant Design (componentes UI)
- CSS Modules (estilos)

## 🐛 Solución de problemas

### El sidebar no se ve

Verifica que Ant Design esté instalado:

```bash
npm install antd
```

### Errores de autenticación

Asegúrate de que:

1. El backend esté corriendo en `https://localhost:7166`
2. Las credenciales sean correctas
3. La configuración CORS esté correcta en el backend

### Módulos muestran 404

Es normal, los módulos están en desarrollo. Solo Dashboard está implementado.
