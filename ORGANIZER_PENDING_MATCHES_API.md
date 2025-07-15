# API de Partidos Pendientes del Organizador
## Nuevo Endpoint: Obtener todos los partidos pendientes de calificar
### Descripción

Este endpoint permite a un organizador obtener todos los partidos pendientes de calificar de todos sus torneos en una sola llamada. Esta vista está diseñada para la sección de "Actividades" del organizador, mostrando partidos de diferentes torneos que requieren asignación de resultados.

### Endpoint
```
GET /organizer/pending-matches
```

### Autenticación
- **Requerida**: Sí
- **Tipo**: JWT Bearer Token
- **Roles**: ORGANIZER únicamente

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Respuesta Exitosa (200)

#### Estructura de la Respuesta
```json
[
  {
    "matchId": "uuid",
    "date": "2024-01-15T14:30:00.000Z",
    "status": "scheduled",
    "tournament": {
      "id": "tournament-uuid",
      "name": "Copa de Fútbol 2024",
      "category": "Fútbol"
    },
    "teamA": {
      "id": "team-a-uuid",
      "name": "Equipo Águilas",
      "logo": "https://example.com/logo-aguilas.png"
    },
    "teamB": {
      "id": "team-b-uuid",
      "name": "Equipo Leones",
      "logo": "https://example.com/logo-leones.png"
    }
  }
]
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `matchId` | string | ID único del partido |
| `date` | string (ISO 8601) | Fecha y hora programada del partido |
| `status` | string | Estado del partido (siempre "scheduled" para pendientes) |
| `tournament.id` | string | ID único del torneo |
| `tournament.name` | string | Nombre del torneo |
| `tournament.category` | string | Categoría/deporte del torneo |
| `teamA.id` | string | ID único del primer equipo |
| `teamA.name` | string | Nombre del primer equipo |
| `teamA.logo` | string | URL del logo del primer equipo (opcional) |
| `teamB.id` | string | ID único del segundo equipo |
| `teamB.name` | string | Nombre del segundo equipo |
| `teamB.logo` | string | URL del logo del segundo equipo (opcional) |

### Ejemplo de Uso

#### cURL
```bash
curl -X GET http://localhost:3000/organizer/pending-matches \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/organizer/pending-matches', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const pendingMatches = await response.json();
console.log('Partidos pendientes:', pendingMatches);
```

### Lógica de Funcionamiento

1. **Autenticación**: El endpoint verifica que el usuario esté autenticado y tenga rol de ORGANIZER
2. **Búsqueda de Torneos**: Busca todos los torneos creados por el organizador logueado
3. **Filtrado de Partidos**: Obtiene todos los partidos con status "scheduled" de esos torneos
4. **Ordenamiento**: Los partidos se devuelven ordenados por fecha (más próximos primero)
5. **Información Completa**: Incluye información del torneo y ambos equipos para cada partido

### Casos de Uso

1. **Vista de Actividades**: Mostrar todos los partidos pendientes en la sección de actividades del organizador
2. **Navegación Rápida**: Al hacer clic en una tarjeta, redirigir a los detalles del torneo específico
3. **Gestión Centralizada**: Ver partidos de múltiples torneos en una sola vista
4. **Priorización**: Identificar partidos más próximos que requieren atención

### Diferencias con Otros Endpoints

| Aspecto | `/tournaments/{id}/matches` | `/organizer/pending-matches` |
|---------|----------------------------|------------------------------|
| Alcance | Un torneo específico | Todos los torneos del organizador |
| Filtro | Todos los partidos | Solo partidos pendientes |
| Autenticación | Opcional | Requerida (ORGANIZER) |
| Funcionalidad | Ver partidos completos | Vista de actividades |

### Seguridad

- ✅ Autenticación JWT requerida
- ✅ Verificación de rol ORGANIZER
- ✅ Solo muestra partidos de torneos del organizador logueado
- ✅ Solo muestra partidos pendientes de calificar
- ✅ No expone información sensible

### Notas Técnicas

- **Controlador**: `OrganizerController.getAllPendingMatches()`
- **Servicio**: `TournamentsService.getAllPendingMatchesByOrganizer()`
- **DTO**: `OrganizerPendingMatchesResponseDto`
- **Relaciones**: Utiliza relaciones de TypeORM para optimizar consultas
- **Performance**: Consulta eficiente que filtra por organizador y estado en una sola query
- **Ordenamiento**: Los resultados se ordenan por fecha ascendente para priorizar partidos próximos

### Respuestas de Error

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```