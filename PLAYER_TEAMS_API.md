# API de Equipos del Jugador

## Endpoint: Obtener mis equipos

### Descripción
Este endpoint permite a un usuario autenticado obtener todos los equipos que ha creado (donde es capitán), junto con la información del torneo al que cada equipo está inscrito.

### Endpoint
```
GET /player/teams
```

### Autenticación
- **Requerida**: Sí
- **Tipo**: JWT Bearer Token
- **Roles**: Cualquier usuario autenticado (PLAYER u ORGANIZER)

### Headers
```
Authorization: Bearer <jwt_token>
```

### Respuesta Exitosa (200 OK)

```json
[
  {
    "teamId": "equipo-123",
    "teamName": "Los Titanes de Chiapas",
    "teamLogo": "url-del-logo.png",
    "tournament": {
      "tournamentId": "torneo-abc",
      "tournamentName": "Torneo Relámpago de Fútbol"
    }
  },
  {
    "teamId": "equipo-456",
    "teamName": "Otro Equipo Genial",
    "teamLogo": "url-de-otro-logo.png",
    "tournament": {
      "tournamentId": "torneo-xyz",
      "tournamentName": "Copa de Verano de Voleibol"
    }
  }
]
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `teamId` | string | ID único del equipo |
| `teamName` | string | Nombre del equipo |
| `teamLogo` | string | URL del logo del equipo (opcional) |
| `tournament.tournamentId` | string | ID único del torneo |
| `tournament.tournamentName` | string | Nombre del torneo |

### Respuestas de Error

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
curl -X GET http://localhost:3000/player/teams \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/player/teams', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});

const teams = await response.json();
console.log(teams);
```

### Lógica de Funcionamiento

1. **Autenticación**: El endpoint verifica que el usuario esté autenticado mediante JWT
2. **Búsqueda de Equipos**: Busca todos los equipos donde el usuario es capitán
3. **Obtención de Inscripciones**: Para cada equipo, obtiene todas las inscripciones a torneos
4. **Mapeo de Datos**: Crea una respuesta que incluye información del equipo y del torneo para cada inscripción
5. **Respuesta**: Retorna un array con todos los equipos y sus respectivos torneos

### Casos Especiales

- Si un equipo está inscrito en múltiples torneos, aparecerá una entrada por cada torneo
- Si un equipo no está inscrito en ningún torneo, no aparecerá en la respuesta
- Solo se muestran equipos donde el usuario es capitán (creador del equipo)
- Si el usuario no ha creado ningún equipo, se retorna un array vacío

### Notas Técnicas

- **Controlador**: `PlayerController.getMyTeams()`
- **Servicio**: `TeamsService.findTeamsByPlayer()`
- **DTO**: `PlayerTeamsResponseDto`
- **Relaciones**: Utiliza relaciones de TypeORM para optimizar consultas
- **Performance**: Consulta eficiente que carga equipos con sus inscripciones y torneos en una sola query

### Seguridad

- Requiere autenticación JWT válida
- Solo muestra equipos creados por el usuario autenticado
- No expone información sensible de otros usuarios
- Utiliza guards de autenticación de NestJS