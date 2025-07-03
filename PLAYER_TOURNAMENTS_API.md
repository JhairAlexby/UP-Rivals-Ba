# API de Torneos del Jugador

## Nuevo Endpoint: Obtener mis torneos

### Descripción
Este endpoint permite a un usuario autenticado obtener todos los torneos en los que está inscrito, ya sea como capitán o como miembro de un equipo.

### Endpoint
```
GET /player/my-tournaments
```

### Autenticación
- **Requerida**: Sí
- **Tipo**: JWT Bearer Token
- **Roles**: Cualquier usuario autenticado (PLAYER u ORGANIZER)

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Respuesta Exitosa (200 OK)
```json
[
  {
    "id": "uuid-del-torneo",
    "name": "Torneo de Fútbol Universitario",
    "category": "Fútbol",
    "modality": "11 vs 11",
    "rules": "Reglas FIFA aplicables",
    "startDate": "2024-04-01T00:00:00.000Z",
    "endDate": "2024-04-30T23:59:59.000Z",
    "maxTeams": 16,
    "status": "open",
    "inscriptionStatus": "approved",
    "teamName": "Los Tigres",
    "teamId": "uuid-del-equipo",
    "organizer": {
      "id": "uuid-del-organizador",
      "name": "Juan Pérez",
      "email": "juan.perez@universidad.edu"
    }
  }
]
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | ID único del torneo |
| `name` | string | Nombre del torneo |
| `category` | string | Categoría del torneo |
| `modality` | string | Modalidad del torneo |
| `rules` | string | Reglas del torneo (opcional) |
| `startDate` | Date | Fecha de inicio del torneo |
| `endDate` | Date | Fecha de finalización del torneo |
| `maxTeams` | number | Número máximo de equipos |
| `status` | string | Estado del torneo (open, closed, etc.) |
| `inscriptionStatus` | string | Estado de la inscripción (pending, approved, rejected) |
| `teamName` | string | Nombre del equipo con el que está inscrito |
| `teamId` | string | ID del equipo con el que está inscrito |
| `organizer` | object | Información del organizador del torneo |

### Casos de Error

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

### Ejemplo de Uso

#### cURL
```bash
curl -X GET http://localhost:3000/player/my-tournaments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/player/my-tournaments', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const myTournaments = await response.json();
console.log(myTournaments);
```

### Lógica de Funcionamiento

1. **Autenticación**: El endpoint verifica que el usuario esté autenticado mediante JWT
2. **Búsqueda de Equipos**: Busca todos los equipos donde el usuario es:
   - Capitán del equipo
   - Miembro del equipo
3. **Obtención de Inscripciones**: Para cada equipo, obtiene todas las inscripciones a torneos
4. **Eliminación de Duplicados**: Si un usuario está en múltiples equipos inscritos al mismo torneo, solo se muestra una vez
5. **Información Completa**: Incluye información del torneo, estado de inscripción, equipo y organizador

### Seguridad

- ✅ Autenticación JWT requerida
- ✅ Solo muestra torneos donde el usuario está inscrito
- ✅ No expone información sensible de otros usuarios
- ✅ Validación de permisos a nivel de controlador

### Notas Técnicas

- **Controlador**: `PlayerController`
- **Servicio**: `TournamentsService.findTournamentsByPlayer()`
- **DTO**: `PlayerTournamentResponseDto`
- **Relaciones**: Utiliza relaciones de TypeORM para optimizar consultas
- **Performance**: Usa Map para evitar duplicados de manera eficiente