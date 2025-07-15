# API de Partidos Pendientes para Jugadores

## Endpoint: GET /player/pending-matches

### Descripción
Este endpoint permite a los jugadores autenticados ver todos los partidos pendientes de los torneos en los que están inscritos (ya sea como capitán o miembro de un equipo).

### Características
- **Autenticación requerida**: JWT token
- **Rol**: Cualquier usuario autenticado (jugador)
- **Filtrado automático**: Solo muestra partidos donde el usuario participa
- **Información del equipo**: Incluye detalles sobre cuál es el equipo del usuario

### URL
```
GET /player/pending-matches
```

### Headers
```
Authorization: Bearer <jwt_token>
```

### Respuesta Exitosa (200 OK)
```json
[
  {
    "matchId": "uuid-del-partido",
    "date": "2024-01-15T14:00:00.000Z",
    "status": "scheduled",
    "tournament": {
      "id": "uuid-del-torneo",
      "name": "Copa de Verano 2024",
      "category": "Fútbol 11"
    },
    "teamA": {
      "id": "uuid-equipo-a",
      "name": "Los Tigres",
      "logo": "url-del-logo-a"
    },
    "teamB": {
      "id": "uuid-equipo-b",
      "name": "Las Águilas",
      "logo": "url-del-logo-b"
    },
    "userTeam": {
      "id": "uuid-equipo-a",
      "name": "Los Tigres",
      "logo": "url-del-logo-a",
      "isTeamA": true
    }
  },
  {
    "matchId": "uuid-del-partido-2",
    "date": "2024-01-18T16:30:00.000Z",
    "status": "scheduled",
    "tournament": {
      "id": "uuid-del-torneo-2",
      "name": "Liga Universitaria",
      "category": "Fútbol 7"
    },
    "teamA": {
      "id": "uuid-equipo-c",
      "name": "Los Leones",
      "logo": "url-del-logo-c"
    },
    "teamB": {
      "id": "uuid-equipo-d",
      "name": "Los Halcones",
      "logo": "url-del-logo-d"
    },
    "userTeam": {
      "id": "uuid-equipo-d",
      "name": "Los Halcones",
      "logo": "url-del-logo-d",
      "isTeamA": false
    }
  }
]
```

### Respuesta Vacía (200 OK)
```json
[]
```

### Errores Posibles

#### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Campos de Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `matchId` | string | ID único del partido |
| `date` | string (ISO) | Fecha y hora programada del partido |
| `status` | string | Estado del partido (siempre "scheduled" para pendientes) |
| `tournament.id` | string | ID del torneo |
| `tournament.name` | string | Nombre del torneo |
| `tournament.category` | string | Categoría del torneo |
| `teamA.id` | string | ID del primer equipo |
| `teamA.name` | string | Nombre del primer equipo |
| `teamA.logo` | string | URL del logo del primer equipo |
| `teamB.id` | string | ID del segundo equipo |
| `teamB.name` | string | Nombre del segundo equipo |
| `teamB.logo` | string | URL del logo del segundo equipo |
| `userTeam.id` | string | ID del equipo del usuario |
| `userTeam.name` | string | Nombre del equipo del usuario |
| `userTeam.logo` | string | URL del logo del equipo del usuario |
| `userTeam.isTeamA` | boolean | Indica si el equipo del usuario es teamA (true) o teamB (false) |

### Lógica de Funcionamiento

1. **Identificación de equipos**: El sistema busca todos los equipos donde el usuario es capitán o miembro
2. **Filtrado de partidos**: Solo incluye partidos donde al menos uno de los equipos del usuario participa
3. **Estado pendiente**: Solo muestra partidos con status "scheduled"
4. **Ordenamiento**: Los partidos se ordenan por fecha ascendente
5. **Información del equipo**: Incluye detalles específicos sobre cuál es el equipo del usuario en cada partido

### Casos de Uso

- **Vista de próximos partidos**: Mostrar al jugador sus próximos compromisos
- **Planificación**: Ayudar al jugador a organizar su calendario
- **Navegación**: Permitir acceso rápido a detalles del torneo usando `tournament.id`
- **Identificación visual**: Usar `userTeam.isTeamA` para destacar el equipo del usuario en la UI

### Diferencias con el Endpoint de Organizadores

| Característica | Organizadores | Jugadores |
|----------------|---------------|----------|
| Endpoint | `/organizer/pending-matches` | `/player/pending-matches` |
| Filtro | Torneos creados por el organizador | Torneos donde el usuario está inscrito |
| Campo especial | - | `userTeam` (información del equipo del usuario) |
| Propósito | Gestión y calificación | Visualización y planificación |

### Notas de Seguridad

- Solo muestra partidos de torneos donde el usuario está legítimamente inscrito
- No expone información de otros jugadores más allá de datos básicos del equipo
- Requiere autenticación válida para acceder