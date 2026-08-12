### Tecnologias utilizadas en el front
Frontend
React (Create React App / Javascript)

Axios (Cliente HTTP con interceptor para JWT)

CSS Modules / Bootstrap


### Despliegue de la acplicacion completa 

Despliegue en Producción
Base de Datos: Instancia desplegada en Aiven MySQL con base de datos planta_gestion.

Backend: Subido a Railway dividiendo la raíz por cada microservicio mediante Root Directory:

/auth-service

/production-service

/fabricacion-service

Frontend: Conectado a Vercel desde GitHub con la regla de reescritura en vercel.json para soporte de SPA (react-router-dom).