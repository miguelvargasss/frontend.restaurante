# 🔧 Configuración del Frontend - Restaurant App

## 📋 Requisitos previos

- Node.js 18+ instalado
- Backend C# corriendo en `https://localhost:7166`

## 🚀 Configuración inicial

### 1. Variables de entorno

Crea un archivo `.env.development` en la raíz del proyecto:

```env
VITE_API_URL=https://localhost:7166/api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

## 🔐 Configuración de HTTPS en desarrollo

### Problema: Certificado SSL autofirmado

Si ves errores de certificado SSL, tienes dos opciones:

#### Opción 1: Confiar en el certificado (Recomendado)

1. Abre Chrome/Edge en `https://localhost:7166`
2. Haz clic en "Avanzado" → "Continuar a localhost"
3. Esto guardará el certificado temporalmente

#### Opción 2: Deshabilitar validación SSL (Solo desarrollo)

En `vite.config.ts`, agrega:

```typescript
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7166",
        changeOrigin: true,
        secure: false, // Deshabilita validación SSL
      },
    },
  },
});
```

## 📡 Endpoints configurados

- **Login:** `POST /api/auth/login`
- **Logout:** `POST /api/auth/logout`
- **Refresh:** `POST /api/auth/refresh`
- **Me:** `GET /api/auth/me`

## 🔑 Estructura de datos de autenticación

### Petición de Login:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Respuesta esperada del backend:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Usuario",
    "role": "Admin"
  }
}
```

## 🐛 Solución de problemas

### Error: CORS

Verifica que tu backend tenga:

```csharp
app.UseCors("AllowReactApp");
```

Y que la configuración incluya:

```csharp
.WithOrigins("http://localhost:5173")
.AllowCredentials();
```

### Error: NET::ERR_CERT_AUTHORITY_INVALID

Es normal en desarrollo con HTTPS. Sigue las instrucciones de "Configuración de HTTPS" arriba.

### Error: 401 Unauthorized

Verifica que:

1. Las credenciales sean correctas
2. El JWT esté configurado correctamente en el backend
3. El token se esté enviando en el header `Authorization: Bearer <token>`

## 📦 Scripts disponibles

```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar para producción
npm run preview      # Preview de producción
npm run lint         # Verificar código
```
