UP-Rivals-Ba
Backend para la plataforma de gestión de torneos deportivos universitarios de la Universidad Politécnica de Chiapas.

1. Configuración Inicial
Sigue estos pasos para levantar el entorno de desarrollo.

Levantar la base de datos

docker-compose up -d

Instalar dependencias

npm install

Configurar variables de entorno

Clona el archivo env.template y renómbralo a .env.

Llena todas las variables requeridas en el archivo .env (credenciales de la base de datos, JWT_SECRET y las credenciales de CLOUDINARY).

Ejecutar la aplicación

npm run start:dev

2. Herramientas de Desarrollo
Seeder (Poblar Base de Datos con Datos de Prueba)
Para facilitar las pruebas, puedes usar el Seeder para limpiar la base de datos y llenarla con un conjunto de datos predefinidos (1 organizador, 4 jugadores, 1 torneo, 4 equipos inscritos y 3 de ellos aprobados).

Método: POST

URL: http://localhost:3000/seed/execute

Nota: Este endpoint no requiere autorización ni cuerpo (body).

3. Guía para Probar Endpoints con Postman
Módulo de Autenticación (/auth)
Rutas Públicas
A. Registrar un nuevo usuario
Método: POST

URL: http://localhost:3000/auth/register

Body (raw, JSON):

{
  "name": "Jhair Palacios",
  "email": "jhair.player@upchiapas.edu.mx",
  "password": "PasswordTest123!",
  "phone": "9612345678",
  "role": "player"
}

B. Iniciar sesión
Método: POST

URL: http://localhost:3000/auth/login

Body (raw, JSON): (Usa las credenciales del Seeder para pruebas)

{
    "email": "organizer@upchiapas.edu.mx",
    "password": "PasswordTest123!"
}

¡Copia el accessToken para usarlo en los siguientes pasos!

Rutas Protegidas (Requieren autenticación)
Para todas las siguientes peticiones, asegúrate de añadir el Bearer Token en la pestaña Authorization.

A. Ver mi perfil
Método: GET

URL: http://localhost:3000/auth/profile

Nota: Devuelve la información del usuario que está actualmente logueado (ideal para que la app muestre el nombre, foto, ID, etc.).

B. Ver todos los usuarios
Método: GET

URL: http://localhost:3000/auth

C. Ver un usuario por ID
Método: GET

URL: http://localhost:3000/auth/:id

Módulo de Subida de Archivos (/files)
Este módulo se encarga de recibir imágenes y subirlas a la nube (Cloudinary).

A. Subir una imagen
Método: POST

URL: http://localhost:3000/files/upload

Body: form-data

Key: file

Value: (Selecciona un archivo de imagen)

Respuesta:

{
  "secure_url": "[https://res.cloudinary.com/.../imagen.jpg](https://res.cloudinary.com/.../imagen.jpg)"
}

Nota: La secure_url devuelta se debe usar para actualizar las fotos de perfil o logos de equipo.

Módulo de Equipos (/teams)
Rutas Protegidas (Requieren autenticación)
A. Crear un nuevo equipo
Método: POST

URL: http://localhost:3000/teams

Body (raw, JSON):

{
  "name": "Los Gladiadores",
  "logo": "URL_OBTENIDA_DE_/files/upload"
}

B. Añadir un miembro a un equipo
Método: POST

URL: http://localhost:3000/teams/:teamId/members

Nota: Solo el capitán del equipo puede añadir miembros.

C. Actualizar un equipo
Método: PATCH

URL: http://localhost:3000/teams/:id

Nota: Solo el capitán del equipo puede actualizarlo.

Módulo de Torneos (/tournaments)
Rutas Públicas
Listar todos los torneos: GET /tournaments

Ver un torneo por su ID: GET /tournaments/:id

Ver la tabla de posiciones de un torneo: GET /tournaments/:id/standings

Ver los partidos de un torneo: GET /tournaments/:id/matches

Rutas Protegidas
Ver mis torneos creados: GET /tournaments/my-tournaments

Inscribir un equipo a un torneo: POST /tournaments/:tournamentId/inscribe/:teamId (Solo el capitán)

Rutas de Organizador (Requieren rol de organizer)
Crear un nuevo torneo: POST /tournaments

Actualizar un torneo: PATCH /tournaments/:id

Eliminar un torneo: DELETE /tournaments/:id

Ver solicitudes de inscripción: GET /tournaments/:tournamentId/inscriptions

Aprobar/Rechazar una inscripción: PATCH /tournaments/:tournamentId/inscriptions/:teamId

Generar calendario automático: POST /tournaments/:id/generate-schedule

Módulo de Partidos (/matches)
Rutas Protegidas (Requieren rol de