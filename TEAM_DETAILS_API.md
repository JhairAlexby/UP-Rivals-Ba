# API: GET /teams/:id - Detalles del Equipo

## Descripción
Este endpoint permite obtener los detalles completos de un equipo específico por su ID, incluyendo información del capitán, miembros e inscripciones a torneos.

## Endpoint
```
GET /teams/:id
```

## Parámetros
- **id** (string, requerido): ID único del equipo

## Autenticación
- **Requerida**: Sí
- **Tipo**: JWT Bearer Token
- **Roles**: Cualquier usuario autenticado

## Headers
```
Authorization: Bearer <jwt_token>
```

## Respuesta Exitosa (200 OK)

```json
{
  "id": "69fa7fec-ee02-416a-b242-83af26d24f58",
  "name": "Los Titanes de Chiapas",
  "logo": "https://example.com/logo.png",
  "captain": {
    "id": "captain-uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "members": [
    {
      "userId": "member1-uuid",
      "teamId": "69fa7fec-ee02-416a-b242-83af26d24f58",
      "user": {
        "id": "member1-uuid",
        "name": "María García",
        "email": "maria@example.com"
      }
    },
    {
      "userId": "member2-uuid",
      "teamId": "69fa7fec-ee02-416a-b242-83af26d24f58",
      "user": {
        "id": "member2-uuid",
        "name": "Carlos López",
        "email": "carlos@example.com"
      }
    }
  ],
  "inscriptions": [
    {
      "id": "inscription-uuid",
      "status": "approved",
      "tournament": {
        "id": "tournament-uuid",
        "name": "Torneo Relámpago de Fútbol",
        "category": "Fútbol",
        "modality": "5v5"
      }
    }
  ]
}
```

## Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único del equipo |
| `name` | string | Nombre del equipo |
| `logo` | string | URL del logo del equipo (opcional) |
| `captain` | object | Información del capitán del equipo |
| `captain.id` | string | ID del capitán |
| `captain.name` | string | Nombre del capitán |
| `captain.email` | string | Email del capitán |
| `members` | array | Lista de miembros del equipo |
| `members[].userId` | string | ID del usuario miembro |
| `members[].teamId` | string | ID del equipo |
| `members[].user` | object | Información completa del usuario |
| `inscriptions` | array | Lista de inscripciones a torneos |
| `inscriptions[].id` | string | ID de la inscripción |
| `inscriptions[].status` | string | Estado de la inscripción |
| `inscriptions[].tournament` | object | Información del torneo |

## Respuestas de Error

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Equipo con ID \"invalid-id\" no encontrado.",
  "error": "Not Found"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Ejemplo de Uso

### cURL
```bash
curl -X GET "http://localhost:3000/teams/69fa7fec-ee02-416a-b242-83af26d24f58" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### JavaScript (Fetch)
```javascript
const teamId = '69fa7fec-ee02-416a-b242-83af26d24f58';
const response = await fetch(`http://localhost:3000/teams/${teamId}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const team = await response.json();
  console.log('Detalles del equipo:', team);
} else {
  console.error('Error:', response.status, response.statusText);
}
```

## Casos de Uso

1. **Mostrar detalles de equipo**: Cuando el usuario selecciona un equipo de la lista
2. **Verificar miembros**: Para mostrar quiénes forman parte del equipo
3. **Ver inscripciones**: Para conocer en qué torneos está participando el equipo
4. **Editar equipo**: Como paso previo para cargar datos actuales antes de editar

## Notas Técnicas

- **Controlador**: `TeamsController.findOne()`
- **Servicio**: `TeamsService.findOne()`
- **Relaciones cargadas**: captain, members, members.user, inscriptions, inscriptions.tournament
- **Performance**: Consulta optimizada que carga todas las relaciones necesarias en una sola query
- **Validación**: Verifica que el equipo exista antes de retornar datos

## Seguridad

- Requiere autenticación JWT válida
- No hay restricciones de autorización (cualquier usuario autenticado puede ver detalles de equipos)
- No expone información sensible como contraseñas
- Utiliza guards de autenticación de NestJS

## Relación con otras APIs

Esta API resuelve el problema de inconsistencia reportado por el frontend:
- `GET /player/teams` devuelve una lista con `teamId`
- `GET /teams/:id` ahora permite obtener detalles usando ese mismo `teamId`
- Los IDs son consistentes entre ambas APIs