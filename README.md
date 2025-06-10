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

## 2. Guía para Probar Endpoints con Postman

### Módulo de Autenticación (`/auth`)

#### Rutas Públicas

##### A. Registrar un nuevo usuario
* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/register`
* **Body (raw, JSON):**
    ```json
    {
      "name": "Jhair Palacios",
      "email": "jhair.organizer@upchiapas.edu.mx",
      "password": "PasswordTest123!",
      "phone": "9612345678",
      "role": "organizer"
    }
    ```

##### B. Iniciar sesión
Este endpoint te devolverá el `accessToken` que necesitas para acceder a las rutas protegidas.
* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/login`
* **Body (raw, JSON):**
    ```json
    {
        "email": "jhair.organizer@upchiapas.edu.mx",
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
* **Nota:** Cualquier usuario autenticado (`player` u `organizer`) puede crear un equipo.
* **Body (raw, JSON):**
    ```json
    {
      "name": "Los Halcones de Chiapas",
      "logo": "[https://i.imgur.com/some-logo.png](https://i.imgur.com/some-logo.png)"
    }
    ```

##### B. Añadir un miembro a un equipo
* **Método:** `POST`
* **URL:** `http://localhost:3000/teams/:teamId/members`
* **Nota:** Solo el **capitán** del equipo puede añadir miembros. Debes usar el token del capitán.
* **Body (raw, JSON):**
    ```json
    {
      "userId": "ID_DEL_JUGADOR_A_AÑADIR"
    }
    ```
---

### Módulo de Torneos (`/tournaments`)

#### Rutas Públicas

##### A. Listar todos los torneos
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments`

##### B. Ver un torneo por su ID
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:id`

#### Rutas Protegidas

Para todas las siguientes peticiones, debes estar autenticado.

##### A. Ver mis torneos creados
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/my-tournaments`
* **Nota:** Devuelve todos los torneos creados por el usuario logueado.

##### B. Inscribir un equipo a un torneo
* **Método:** `POST`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscribe/:teamId`
* **Nota:** Solo el **capitán** del equipo puede inscribirlo. Debes usar el token del capitán.

#### Rutas de Organizador (Requieren rol de `organizer`)

##### A. Crear un nuevo torneo
* **Método:** `POST`
* **URL:** `http://localhost:3000/tournaments`
* **Body (raw, JSON):**
    ```json
    {
      "name": "Torneo de Fútbol Rápido",
      "category": "Fútbol",
      "modality": "Varonil",
      "maxTeams": 12,
      "startDate": "2025-09-01T10:00:00.000Z",
      "endDate": "2025-09-30T18:00:00.000Z"
    }
    ```

##### B. Actualizar un torneo
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/tournaments/:id`
* **Nota:** Solo el organizador que creó el torneo puede actualizarlo.

##### C. Eliminar un torneo
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/tournaments/:id`
* **Nota:** Solo el organizador que creó el torneo puede eliminarlo.

##### D. Ver solicitudes de inscripción
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscriptions`
* **Nota:** Solo el organizador del torneo puede ver las solicitudes.

##### E. Aprobar/Rechazar una inscripción
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscriptions/:teamId`
* **Nota:** Solo el organizador del torneo puede gestionar las solicitudes.
* **Body (raw, JSON):**
    ```json
    {
      "status": "approved"
    }
    ```
