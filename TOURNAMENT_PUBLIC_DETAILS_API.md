# API de Detalles Públicos de Torneo

## Endpoint: GET /tournaments/:id/public

### Descripción
Este endpoint permite a cualquier visitante (sin autenticación) ver los detalles básicos de un torneo específico.

### Características
- **Acceso público**: No requiere autenticación ni token JWT
- **Solo lectura**: Proporciona información básica del torneo
- **Sin información de registro**: No incluye el estado de registro del usuario

### URL
```
GET /tournaments/:id/public
```

### Parámetros
- `id` (string, requerido): ID único del torneo

### Respuesta Exitosa (200 OK)
```json
{
  "id": "uuid-del-torneo",
  "name": "Nombre del Torneo",
  "description": "Descripción del torneo",
  "category": "Categoría del torneo",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-20T00:00:00.000Z",
  "maxTeams": 16,
  "location": "Ubicación del torneo",
  "rules": "Reglas del torneo",
  "prizes": "Premios del torneo",
  "organizer": {
    "id": "uuid-del-organizador",
    "name": "Nombre del Organizador",
    "email": "organizador@email.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Errores Posibles

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Tournament with ID \"invalid-id\" not found",
  "error": "Not Found"
}
```

### Diferencias con el Endpoint Autenticado

| Característica | GET /tournaments/:id | GET /tournaments/:id/public |
|----------------|---------------------|-----------------------------|
| Autenticación | Requerida (JWT) | No requerida |
| Campo `isRegistered` | Incluido | No incluido |
| Información del torneo | Completa + estado de registro | Solo información básica |
| Uso recomendado | Usuarios autenticados | Visitantes públicos |

### Casos de Uso
- Páginas de aterrizaje públicas de torneos
- Compartir información de torneos en redes sociales
- Permitir que visitantes vean detalles antes de registrarse
- Mostrar información básica en listados públicos

### Notas de Implementación
- Este endpoint complementa el endpoint autenticado existente
- Mantiene la misma estructura de datos excepto por el campo `isRegistered`
- Utiliza el mismo servicio base pero sin verificación de registro del usuario
- No expone información sensible del organizador más allá de datos básicos