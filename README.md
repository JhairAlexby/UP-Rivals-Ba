<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# UP-Rivals-Ba

Backend para la plataforma de gestión de torneos deportivos universitarios.

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

### Rutas Públicas (No requieren autenticación)

#### A. Registrar un nuevo usuario

* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/register`
* **Body (raw, JSON):**
    ```json
    {
      "name": "Jhair Palacios",
      "email": "jhair.test@upchiapas.edu.mx",
      "password": "PasswordTest123!",
      "phone": "9612345678",
      "role": "organizer"
    }
    ```

#### B. Iniciar sesión

Este endpoint te devolverá el `accessToken` que necesitas para acceder a las rutas protegidas.

* **Método:** `POST`
* **URL:** `http://localhost:3000/auth/login`
* **Body (raw, JSON):**
    ```json
    {
        "email": "jhair.test@upchiapas.edu.mx",
        "password": "PasswordTest123!"
    }
    ```
* **Respuesta:**
    ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."
    }
    ```
**¡Copia el `accessToken` para usarlo en los siguientes pasos!**

---

### Rutas Protegidas (Requieren autenticación)

Para todas las siguientes peticiones, debes configurar la autenticación en Postman:
1.  Ve a la pestaña **`Authorization`**.
2.  Selecciona `Type`: **`Bearer Token`**.
3.  Pega el `accessToken` que copiaste en el campo `Token`.



#### A. Obtener todos los usuarios

* **Método:** `GET`
* **URL:** `http://localhost:3000/auth`

#### B. Obtener un usuario por su ID

* **Método:** `GET`
* **URL:** `http://localhost:3000/auth/:id`

#### C. Modificar un usuario

* **Método:** `PATCH`
* **URL:** `http://localhost:3000/auth/:id`
* **Body (raw, JSON):** (Solo incluye los campos que quieras modificar)
    ```json
    {
      "name": "Jhair Alejandro Cruz Palacios",
      "phone": "9619876543"
    }
    ```

#### D. Eliminar un usuario (Borrado Lógico)

* **Método:** `PATCH`
* **URL:** `http://localhost:3000/auth/soft-delete/:id`

#### E. Eliminar un usuario (Borrado Físico)

* **Método:** `DELETE`
* **URL:** `http://localhost:3000/auth/:id`
