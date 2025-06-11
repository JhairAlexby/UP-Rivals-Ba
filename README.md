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
* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/login`

---

### Módulo de Equipos (`/teams`)

#### Rutas Protegidas (Requieren autenticación)

##### A. Crear un nuevo equipo
* **Método:** `POST`
* **URL:** `http://localhost:3000/teams`
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

#### Rutas Protegidas (Requieren autenticación)

##### A. Ver mis torneos creados
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/my-tournaments`

##### B. Inscribir un equipo a un torneo
* **Método:** `POST`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscribe/:teamId`

##### C. Ver solicitudes de inscripción
* **Requiere rol:** `organizer`
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscriptions`

##### D. Aprobar/Rechazar una inscripción
* **Requiere rol:** `organizer`
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/tournaments/:tournamentId/inscriptions/:teamId`
* **Body (raw, JSON):**
    ```json
    { "status": "approved" }
    ```

---

### Módulo de Partidos (`/matches`)

#### Rutas Protegidas (Requieren rol de `organizer`)

##### A. Crear un nuevo partido (enfrentamiento)
* **Método:** `POST`
* **URL:** `http://localhost:3000/matches`
* **Nota:** Solo el organizador del torneo puede crear partidos.
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
* **URL:** `http://localhost:3000/matches/:idDelEnfrentamiento/result`
* **Nota:** Solo el organizador del torneo puede registrar resultados.
* **Body (raw, JSON):**
    ```json
    {
      "teamAScore": 3,
      "teamBScore": 2
    }
    ```
