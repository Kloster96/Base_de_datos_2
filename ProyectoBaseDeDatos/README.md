# 🏨 Proyecto 5: Sistema de Reservas Hotel 

# Integrantes del Grupo 3:
- Angelina Rossi
- Lisandro Alvarez
- Pablo Escalante
- Luciano Kloster
- Francisco Jaszczuk
  
# Dificultad : ⭐⭐⭐

# Descripción
   Plataforma para gestionar habitaciones, huéspedes y reservas de un hotel.

# Requerimientos
   Catálogo de habitaciones con diferentes tipos y precios
   Sistema de reservas con fechas de entrada y salida
   Gestión de huéspedes y su historial
   Control de disponibilidad de habitaciones

# Estructura de Datos
   // Colección: habitaciones
   {
      _id: ObjectId,
      numero: "101",
      tipo: "Suite",
      capacidad: 4,
      precioPorNoche: 150.00,
      amenidades: ["WiFi", "TV", "Minibar", "Balcón"],
      disponible: true
   }

   // Colección: reservas
   {
      _id: ObjectId,
      habitacionId: ObjectId,
      huesped: {
         nombre: "María López",
         email: "maria@email.com",
         telefono: "+1234567890"
      },
      fechaEntrada: ISODate,
      fechaSalida: ISODate,
      noches: 3,
      precioTotal: 450.00,
      estado: "confirmada", // "pendiente", "confirmada", "cancelada"
      fechaReserva: ISODate
   }

# Funciones a Implementar
   consultarDisponibilidad(fechaEntrada, fechaSalida, tipo) - Ver habitaciones disponibles
   crearReserva(reserva) - Crear nueva reserva
   cancelarReserva(reservaId) - Cancelar reserva existente
   checkIn(reservaId) - Registrar entrada del huésped
   reporteOcupacion(mes, año) - Reporte de ocupación mensual

---

## 🚀 Tecnologías utilizadas

- Node.js + Express
- MongoDB + Mongoose
- Joi (para validaciones)
- CORS
- Postman (para testeo manual)

---

## 🧱 Estructura del proyecto
backend/ 
├── controllers/         # Lógica de negocio (habitaciones y reservas) 
├── models/              # Esquemas de MongoDB con Mongoose 
├── routes/              # Enrutamiento con Express 
├── services/            # Lógica auxiliar (disponibilidad)
├── db.js                # Conexión a MongoDB 
├── app.js               # Configuración principal del servidor 
└── README.md            # Este archivo

---

## 📦 Instalación

1. Clonar el repositorio:

   ```bash
   git clone 
   cd Proyecto BaseDeDatos-backend

- Instalar dependencias:
   npm install
   
- Iniciar MongoDB en local:
   mongod

- Ejecutar el servidor:
   node app.js



# 📋 Endpoints principales
🔹 Habitaciones
- POST /api/habitaciones → Crear habitación
- GET /api/habitaciones → Listar todas
- GET /api/habitaciones/capacidad/:capacidad → Filtrar por capacidad mínima
- GET /api/habitaciones/disponibles → Busca las habitaciones disponibles por fecha y tipo 
- PUT /api/habitaciones/:id → Actualizar
- DELETE /api/habitaciones/:id → Eliminar
🔹 Reservas
- POST /api/reservas → Crear reserva
- GET /api/reservas → Ver todas las reservas
- GET /api/reservas/:id → Ver reserva por ID
- PUT /api/reservas/:id → Modificar fechas o datos
- DELETE /api/reservas/:id → Eliminar
- PUT /api/reservas/cancelar/:id → Cancelar
- PUT /api/reservas/checkin/:id → Registrar ingreso
- GET /api/reservas/reporte/:mes/:año → Ver reporte de ocupación

# 📆 Lógica de disponibilidad
La disponibilidad de habitaciones se calcula dinámicamente:
- Se verifica si una habitación está ocupada en el rango de fechas solicitado.
- Solo se considera ocupada si tiene una reserva activa (confirmada o check-in).
- No se usa el campo booleano disponible salvo en casos especiales como mantenimiento manual.

# 🧪 Testeo con Postman
Todos los endpoints se pueden probar desde Postman usando:
http://localhost:3000

Y usando los ejemplos en la carpeta "Backend/test" + IMPORTANTE: todas las fechas deben estar en formato ISOdate


# ⚠️ Validaciones y manejo de errores
- Se usa Joi para validar datos del cliente antes de procesarlos.
- Se responde con códigos HTTP apropiados:
- 201 Created → recurso creado
- 400 Bad Request → datos inválidos
- 404 Not Found → recurso no existe
- 500 Internal Server Error → fallos del servidor
