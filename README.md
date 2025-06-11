<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# UP-Rivals-Ba

Backend para la plataforma de gestión de torneos deportivos universitarios de la Universidad Politécnica de Chiapas.

---

## 1. Configuración Inicial

Sigue estos pasos para levantar el entorno de desarrollo.

1.  **Levantar la base de datos**
    ```bash
    docker-compose up -d
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    * Clona el archivo `env.template` y renómbralo a `.env`.
    * Llena todas las variables requeridas en el archivo `.env` (credenciales de la base de datos y `JWT_SECRET`).

4.  **Ejecutar la aplicación**
    ```bash
    npm run start:dev
    ```
---

## 2. Herramientas de Desarrollo

### Seeder (Poblar Base de Datos con Datos de Prueba)

Para facilitar las pruebas, puedes usar el Seeder para limpiar la base de datos y llenarla con un conjunto de datos predefinidos (1 organizador, 4 jugadores, 1 torneo, 4 equipos inscritos y 3 de ellos aprobados).

* **Método:** `POST`
* **URL:** `http://localhost:3000/seed/execute`
* **Nota:** Este endpoint no requiere autorización ni cuerpo (body).

---

## 3. Guía para Probar Endpoints con Postman

### Módulo de Autenticación (`/auth`)

#### Rutas Públicas

##### A. Registrar un nuevo usuario
* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/register`

##### B. Iniciar sesión
* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/login`
* **Body (raw, JSON):** (Usa las credenciales del Seeder para pruebas)
    ```json
    {
        "email": "organizer@upchiapas.edu.mx",
        "password": "PasswordTest123!"
    }
    ```

**¡Copia el `accessToken` para usarlo en los siguientes pasos!**

---

### Módulo de Equipos (`/teams`)

#### Rutas Protegidas (Requieren autenticación)

##### A. Crear un nuevo equipo
* **Método:** `POST`
* **URL:** `http://localhost:3000/teams`
* **Body (raw, JSON):**
    ```json
    {
      "name": "Los Gladiadores",
      "logo": "[https://i.imgur.com/logo-gladiadores.png](https://i.imgur.com/logo-gladiadores.png)"
    }
    ```

##### B. Añadir un miembro a un equipo
* **Método:** `POST`
* **URL:** `http://localhost:3000/teams/:teamId/members`
* **Nota:** Solo el **capitán** del equipo puede añadir miembros.

---

### Módulo de Torneos (`/tournaments`)

#### Rutas Públicas

##### A. Listar todos los torneos
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments`

##### B. Ver un torneo por su ID
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:id`

##### C. Ver la tabla de posiciones de un torneo
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:id/standings`

##### D. Ver los partidos de un torneo
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:id/matches`

#### Rutas Protegidas

Para las siguientes peticiones, asegúrate de añadir el `Bearer Token` en la pestaña `Authorization`.

##### A. Ver mis torneos creados
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/my-tournaments`

##### B. Inscribir un equipo a un torneo
* **Método:** `POST`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscribe/:teamId`
* **Nota:** Solo el **capitán** del equipo puede inscribirlo.

#### Rutas de Organizador (Requieren rol de `organizer`)

##### A. Crear un nuevo torneo
* **Método:** `POST`
* **URL:** `http://localhost:3000/tournaments`

##### B. Actualizar un torneo
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/tournaments/:id`

##### C. Eliminar un torneo
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/tournaments/:id`

##### D. Ver solicitudes de inscripción de un torneo
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscriptions`

##### E. Aprobar/Rechazar una inscripción
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscriptions/:teamId`
* **Body (raw, JSON):** `{"status": "approved"}`

##### F. Generar calendario de partidos automáticamente
* **Método:** `POST`
* **URL:** `http://localhost:3000/tournaments/:id/generate-schedule`
* **Nota:** Genera un calendario "todos contra todos" (Round Robin) con los equipos aprobados en el torneo.

---

### Módulo de Partidos (`/matches`)

#### Rutas Protegidas (Requieren rol de `organizer`)

##### A. Crear un partido manualmente
* **Método:** `POST`
* **URL:** `http://localhost:3000/matches`
* **Body (raw, JSON):**
    ```json
    {
      "tournamentId": "ID_DEL_TORNEO",
      "teamAId": "ID_DEL_EQUIPO_A",
      "teamBId": "ID_DEL_EQUIPO_B",
      "date": "2025-10-20T19:00:00.000Z"
    }
    ```

##### B. Registrar el resultado de un partido
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/matches/:id/result`
* **Body (raw, JSON):**
    ```json
    {
      "teamAScore": 3,
      "teamBScore": 2
    }
    ```
