# 📡 API Endpoints - Documentación Completa

## 🌐 URL Base

```
https://localhost:7166/api
```

**Configuración:**
```typescript
// .env
VITE_API_URL=https://localhost:7166/api
```

---

## 🔐 Autenticación

### 1. Login
**Endpoint:** `POST /auth/login`

**Descripción:** Iniciar sesión con email y contraseña

**Request Body:**
```json
{
    "email": "usuario@email.com",
    "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "refresh_token_here",
    "user": {
        "id": 1,
        "email": "usuario@email.com",
        "name": "Juan",
        "profileId": 1,
        "profileName": "Admin"
    }
}
```

**Errores:**
- `400` - Credenciales inválidas
- `401` - Email o contraseña incorrectos

---

### 2. Logout
**Endpoint:** `POST /auth/logout`

**Descripción:** Cerrar sesión del usuario

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## 👥 Usuarios

### 1. Listar Usuarios
**Endpoint:** `GET /users`

**Descripción:** Obtener lista de usuarios con filtros opcionales

**Query Parameters:**
- `search` (string, opcional): Texto de búsqueda
- `profileId` (number, opcional): Filtrar por perfil
- `isActive` (boolean, opcional): Filtrar por estado
- `page` (number, opcional): Número de página (default: 1)
- `pageSize` (number, opcional): Tamaño de página (default: 10)

**Ejemplo:**
```
GET /users?search=juan&profileId=1&isActive=true&page=1&pageSize=10
```

**Response (200 OK):**
```json
{
    "users": [
        {
            "id": 1,
            "email": "usuario@email.com",
            "name": "Juan",
            "lastName": "Pérez",
            "isActive": true,
            "profileId": 1,
            "profileName": "Admin",
            "createdAt": "2025-11-29T00:00:00Z"
        }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 10
}
```

---

### 2. Obtener Usuario por ID
**Endpoint:** `GET /users/{id}`

**Descripción:** Obtener detalles completos de un usuario

**Path Parameters:**
- `id` (number): ID del usuario

**Response (200 OK):**
```json
{
    "id": 1,
    "email": "usuario@email.com",
    "name": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "profileId": 1,
    "profileName": "Admin",
    "createdAt": "2025-11-29T00:00:00Z",
    "lastLogin": "2025-11-29T12:00:00Z"
}
```

**Errores:**
- `404` - Usuario no encontrado

---

### 3. Crear Usuario
**Endpoint:** `POST /users`

**Descripción:** Crear un nuevo usuario

**Request Body:**
```json
{
    "email": "nuevo@email.com",
    "password": "contraseña123",
    "name": "Juan",
    "lastName": "Pérez",
    "profileId": 1,
    "isActive": true
}
```

**Response (201 Created):**
```json
{
    "id": 5,
    "email": "nuevo@email.com",
    "name": "Juan",
    "lastName": "Pérez",
    "isActive": true,
    "profileId": 1,
    "profileName": "Admin",
    "createdAt": "2025-11-29T00:00:00Z"
}
```

**Errores:**
- `400` - Datos inválidos
- `409` - Email ya existe
- `404` - Perfil no existe

---

### 4. Actualizar Usuario
**Endpoint:** `PUT /users/{id}`

**Descripción:** Actualizar información de un usuario

**Path Parameters:**
- `id` (number): ID del usuario

**Request Body:**
```json
{
    "name": "Juan Carlos",
    "lastName": "Pérez García",
    "email": "juan.perez@email.com",
    "profileId": 2,
    "isActive": false
}
```

**Response (200 OK):**
```json
{
    "id": 5,
    "email": "juan.perez@email.com",
    "name": "Juan Carlos",
    "lastName": "Pérez García",
    "isActive": false,
    "profileId": 2,
    "profileName": "Cajero"
}
```

**Errores:**
- `400` - Datos inválidos
- `404` - Usuario no encontrado
- `409` - Email ya existe

---

### 5. Eliminar Usuario
**Endpoint:** `DELETE /users/{id}`

**Descripción:** Eliminar un usuario

**Path Parameters:**
- `id` (number): ID del usuario

**Response:** `204 No Content`

**Errores:**
- `404` - Usuario no encontrado
- `409` - No se puede eliminar (usuario en uso)

---

### 6. Obtener Perfiles Simples
**Endpoint:** `GET /profiles/simple`

**Descripción:** Obtener lista simplificada de perfiles para dropdowns

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "name": "Admin",
        "description": "Administrador del sistema"
    },
    {
        "id": 2,
        "name": "Cajero",
        "description": "Usuario cajero"
    }
]
```

---

## 🔑 Perfiles

### 1. Listar Perfiles
**Endpoint:** `GET /profiles`

**Descripción:** Obtener lista de perfiles con filtros opcionales

**Query Parameters:**
- `search` (string, opcional): Texto de búsqueda
- `page` (number, opcional): Número de página (default: 1)
- `pageSize` (number, opcional): Tamaño de página (default: 10)

**Ejemplo:**
```
GET /profiles?search=admin&page=1&pageSize=10
```

**Response (200 OK):**
```json
{
    "profiles": [
        {
            "id": 1,
            "name": "Admin",
            "description": "Administrador del sistema",
            "createdAt": "2025-11-29",
            "hasAdminAccess": true,
            "isActive": true
        }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
}
```

---

### 2. Obtener Perfil por ID
**Endpoint:** `GET /profiles/{id}`

**Descripción:** Obtener perfil completo con todos sus permisos

**Path Parameters:**
- `id` (number): ID del perfil

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "Admin",
    "description": "Administrador del sistema",
    "createdAt": "2025-11-29",
    "hasAdminAccess": true,
    "isActive": true,
    "modules": [
        {
            "id": "dashboard",
            "name": "dashboard",
            "displayName": "Dashboard",
            "permissions": {
                "view": true,
                "edit": true,
                "delete": true
            },
            "components": [
                {
                    "name": "Ver estadísticas",
                    "enabled": true
                }
            ]
        }
    ]
}
```

**Errores:**
- `404` - Perfil no encontrado

---

### 3. Crear Perfil
**Endpoint:** `POST /profiles`

**Descripción:** Crear un nuevo perfil con permisos

**Request Body:**
```json
{
    "name": "Mesero",
    "description": "Perfil para meseros",
    "modules": [
        {
            "id": "pedidos",
            "name": "pedidos",
            "displayName": "Pedidos",
            "permissions": {
                "view": true,
                "edit": true,
                "delete": false
            },
            "components": [
                {
                    "name": "Crear pedido",
                    "enabled": true
                }
            ]
        }
    ]
}
```

**Response (201 Created):**
```json
{
    "id": 6,
    "name": "Mesero",
    "description": "Perfil para meseros",
    "createdAt": "2025-11-29",
    "hasAdminAccess": false,
    "isActive": true,
    "modules": [...]
}
```

**Errores:**
- `400` - Datos inválidos o sin permisos
- `409` - Nombre de perfil ya existe

---

### 4. Actualizar Perfil
**Endpoint:** `PUT /profiles/{id}`

**Descripción:** Actualizar información de un perfil

**Path Parameters:**
- `id` (number): ID del perfil

**Request Body:**
```json
{
    "name": "Mesero Senior",
    "description": "Perfil actualizado",
    "hasAdminAccess": false,
    "isActive": true
}
```

**Response (200 OK):**
```json
{
    "id": 6,
    "name": "Mesero Senior",
    "description": "Perfil actualizado",
    "createdAt": "2025-11-29",
    "hasAdminAccess": false,
    "isActive": true
}
```

**Errores:**
- `400` - Datos inválidos
- `404` - Perfil no encontrado
- `409` - Nombre ya existe

---

### 5. Eliminar Perfil
**Endpoint:** `DELETE /profiles/{id}`

**Descripción:** Eliminar un perfil

**Path Parameters:**
- `id` (number): ID del perfil

**Response:** `204 No Content`

**Errores:**
- `404` - Perfil no encontrado
- `409` - No se puede eliminar (perfil en uso)

---

## 📊 Resumen de Endpoints

| Módulo | Método | Endpoint | Descripción |
|--------|--------|----------|-------------|
| **Auth** | POST | `/auth/login` | Iniciar sesión |
| **Auth** | POST | `/auth/logout` | Cerrar sesión |
| **Users** | GET | `/users` | Listar usuarios |
| **Users** | GET | `/users/{id}` | Obtener usuario |
| **Users** | POST | `/users` | Crear usuario |
| **Users** | PUT | `/users/{id}` | Actualizar usuario |
| **Users** | DELETE | `/users/{id}` | Eliminar usuario |
| **Users** | GET | `/profiles/simple` | Perfiles dropdown |
| **Profiles** | GET | `/profiles` | Listar perfiles |
| **Profiles** | GET | `/profiles/{id}` | Obtener perfil |
| **Profiles** | POST | `/profiles` | Crear perfil |
| **Profiles** | PUT | `/profiles/{id}` | Actualizar perfil |
| **Profiles** | DELETE | `/profiles/{id}` | Eliminar perfil |

**Total:** 13 endpoints

---

## 🔒 Autenticación y Seguridad

### Headers Requeridos

Todos los endpoints (excepto `/auth/login`) requieren autenticación:

```http
Authorization: Bearer {token}
Content-Type: application/json
```

### Obtener Token

El token se obtiene del login y se almacena en `localStorage`:

```typescript
const token = localStorage.getItem('auth_token');
```

### Ejemplo de Request Autenticado

```typescript
const response = await fetch('https://localhost:7166/api/users', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
});
```

---

## ⚠️ Códigos de Error HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| **200** | OK | Solicitud exitosa |
| **201** | Created | Recurso creado exitosamente |
| **204** | No Content | Eliminación exitosa |
| **400** | Bad Request | Datos inválidos o faltantes |
| **401** | Unauthorized | No autenticado (token inválido) |
| **403** | Forbidden | Sin permisos para esta acción |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email duplicado) |
| **500** | Server Error | Error interno del servidor |

---

## 📝 Notas Importantes

### 1. Mapeo de Campos

El backend usa **PascalCase**, el frontend usa **camelCase**:

| Backend | Frontend |
|---------|----------|
| `ProfilId` | `profileId` |
| `NameUser` | `name` |
| `IsActive` | `isActive` |

Se usa `[JsonPropertyName]` en el backend para el mapeo automático.

### 2. Paginación

Los endpoints de listado soportan paginación:
- Default: `page=1`, `pageSize=10`
- Máximo: `pageSize=100`

### 3. Búsqueda

La búsqueda es **case-insensitive** y busca en:
- **Usuarios:** name, lastName, email
- **Perfiles:** name, description

### 4. Filtros

**Usuarios:**
- Por perfil: `profileId=1`
- Por estado: `isActive=true`
- Por búsqueda: `search=texto`

**Perfiles:**
- Por búsqueda: `search=texto`

### 5. Validaciones

**Email:**
- Formato válido requerido
- Único en el sistema

**Contraseña:**
- Mínimo 6 caracteres
- Requerida solo en creación

**Perfil:**
- Debe existir
- Requerido para usuarios

**Permisos:**
- Al menos un permiso requerido para perfiles

---

## 🧪 Ejemplos de Uso

### Login
```typescript
const response = await fetch('https://localhost:7166/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@restaurant.com',
        password: 'admin123'
    })
});
const data = await response.json();
localStorage.setItem('auth_token', data.token);
```

### Crear Usuario
```typescript
const token = localStorage.getItem('auth_token');
const response = await fetch('https://localhost:7166/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        email: 'nuevo@email.com',
        password: 'password123',
        name: 'Juan',
        lastName: 'Pérez',
        profileId: 2,
        isActive: true
    })
});
```

### Listar Usuarios con Filtros
```typescript
const token = localStorage.getItem('auth_token');
const params = new URLSearchParams({
    search: 'juan',
    profileId: '1',
    isActive: 'true',
    page: '1',
    pageSize: '10'
});

const response = await fetch(
    `https://localhost:7166/api/users?${params}`,
    {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
);
```

---

**Última actualización:** 2025-11-29  
**Versión API:** 1.0  
**Base URL:** `https://localhost:7166/api`
