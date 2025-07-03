# API de Inscripciones del Organizador

## Nuevo Endpoint: Obtener todas las solicitudes pendientes

### Descripción
Este endpoint permite a un organizador obtener todas las solicitudes de inscripción pendientes de todos sus torneos en una sola llamada.

### Endpoint
```
GET /organizer/inscriptions
```

### Autenticación
- **Requerida**: Sí
- **Tipo**: JWT Bearer Token
- **Rol requerido**: ORGANIZER

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Respuesta Exitosa (200)

```json
[
  {
    "inscriptionId": "tournament-id-team-id",
    "status": "pending",
    "team": {
      "id": "team-uuid",
      "name": "Los Gladiadores",
      "logo": "https://example.com/logo.png",
      "captain": {
        "id": "user-uuid",
        "email": "captain@example.com",
        "name": "Juan Pérez"
      }
    },
    "tournament": {
      "id": "tournament-uuid",
      "name": "Torneo de Fútbol UP Chiapas",
      "category": "Fútbol",
      "startDate": "2024-02-01T00:00:00.000Z",
      "endDate": "2024-02-28T00:00:00.000Z"
    }
  }
]
```

### Casos de Uso

1. **Dashboard del Organizador**: Mostrar todas las solicitudes pendientes en un solo lugar
2. **Notificaciones**: Contar el número total de solicitudes pendientes
3. **Gestión Masiva**: Permitir al organizador ver y gestionar todas las solicitudes de una vez

### Ejemplo de Uso en Frontend

```javascript
// Obtener todas las solicitudes pendientes
const response = await fetch('/api/organizer/inscriptions', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const pendingInscriptions = await response.json();

// Mostrar en la UI
pendingInscriptions.forEach(inscription => {
  console.log(`El equipo '${inscription.team.name}' quiere unirse al '${inscription.tournament.name}'`);
});
```

### Diferencias con el Endpoint Anterior

| Aspecto | Endpoint Anterior | Nuevo Endpoint |
|---------|-------------------|----------------|
| URL | `/tournaments/{id}/inscriptions` | `/organizer/inscriptions` |
| Alcance | Un torneo específico | Todos los torneos del organizador |
| Filtro | Todas las inscripciones | Solo pendientes |
| Información | Básica | Completa (equipo + torneo) |

### Seguridad

- ✅ Autenticación JWT requerida
- ✅ Verificación de rol ORGANIZER
- ✅ Solo muestra torneos del organizador logueado
- ✅ Solo muestra inscripciones pendientes
- ✅ No expone información sensible

### Códigos de Error

- **401 Unauthorized**: Token JWT inválido o ausente
- **403 Forbidden**: Usuario no tiene rol de ORGANIZER
- **500 Internal Server Error**: Error interno del servidor