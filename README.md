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

### Módulo de Torneos (`/tournaments`)

#### Rutas Públicas

##### A. Listar todos los torneos
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments`

##### B. Ver un torneo por su ID
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/:id`

#### Rutas Protegidas

Para todas las siguientes peticiones, debes configurar la autenticación en Postman:
1.  Ve a la pestaña **`Authorization`**.
2.  Selecciona `Type`: **`Bearer Token`**.
3.  Pega el `accessToken` de un usuario.

##### A. Ver mis torneos creados
* **Método:** `GET`
* **URL:** `http://localhost:3000/tournaments/my-tournaments`
* **Nota:** Devuelve todos los torneos creados por el usuario logueado. Funciona para cualquier rol (si un `player` no ha creado torneos, devolverá una lista vacía).

##### B. Crear un nuevo torneo
* **Requiere rol:** `organizer`
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

##### C. Actualizar un torneo
* **Requiere rol:** `organizer`
* **Método:** `PATCH`
* **URL:** `http://localhost:3000/tournaments/:id`
* **Nota:** Solo el organizador que creó el torneo puede actualizarlo.

##### D. Eliminar un torneo
* **Requiere rol:** `organizer`
* **Método:** `DELETE`
* **URL:** `http://localhost:3000/tournaments/:id`
* **Nota:** Solo el organizador que creó el torneo puede eliminarlo.

---

### Módulo de Equipos (`/teams`)

#### Rutas Protegidas

Para todas las peticiones en este módulo, debes estar autenticado.

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
