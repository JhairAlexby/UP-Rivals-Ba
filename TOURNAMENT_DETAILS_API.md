# API: GET /tournaments/:id - Detalles del Torneo con Estado de Registro

## Descripción
Este endpoint permite obtener los detalles completos de un torneo específico, incluyendo un campo adicional `isRegistered` que indica si el usuario autenticado está registrado en dicho torneo.

## Endpoint
```
GET /tournaments/:id
```

## Autenticación
- **Requerida**: Sí
- **Tipo**: JWT Bearer Token
- **Guard**: `AuthGuard('jwt')`

## Parámetros
- **id** (string, requerido): ID único del torneo

## Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Respuesta Exitosa (200)
```json
{
  "id": "id-del-torneo-123",
  "name": "Copa de Verano",
  "category": "Fútbol",
  "modality": "5v5",
  "maxTeams": 16,
  "startDate": "2024-07-15T00:00:00.000Z",
  "endDate": "2024-07-30T00:00:00.000Z",
  "rules": "Reglas estándar de fútbol 5",
  "status": "active",
  "isRegistered": true
}
```

## Casos de Error

### 401 - No Autorizado
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 - Torneo No Encontrado
```json
{
  "statusCode": 404,
  "message": "Tournament with ID \"invalid-id\" not found",
  "error": "Not Found"
}
```

## Campo `isRegistered`
El campo `isRegistered` indica si el usuario autenticado está registrado en el torneo:
- **true**: El usuario está registrado (como capitán o miembro de un equipo inscrito)
- **false**: El usuario no está registrado en el torneo

## Lógica de Verificación
El sistema verifica si el usuario está registrado mediante:
1. Búsqueda de todos los equipos donde el usuario es capitán o miembro
2. Verificación de inscripciones de esos equipos en el torneo específico
3. Retorno de `true` si encuentra al menos una inscripción, `false` en caso contrario

## Ejemplo de Uso
```bash
curl -X GET "http://localhost:3000/tournaments/123" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Consideraciones de Seguridad
- ✅ **Autenticación JWT**: Protege el endpoint con token válido
- ✅ **Validación de Usuario**: Solo usuarios autenticados pueden acceder
- ✅ **Verificación de Permisos**: El campo `isRegistered` es específico para cada usuario
- ✅ **Manejo de Errores**: Respuestas apropiadas para casos de error

## Notas Técnicas
- **Controlador**: `TournamentsController.findOne()`
- **Servicio**: `TournamentsService.findOneWithRegistrationStatus()`
- **DTO**: `TournamentWithRegistrationDto`
- **Relaciones**: Consulta equipos y sus inscripciones para determinar el estado
- **Optimización**: Consulta eficiente que evita cargar datos innecesarios