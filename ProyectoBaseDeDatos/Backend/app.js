const express = require('express');
const connectDB=require("./db");
const cors = require('cors');
const app = express();


connectDB();
//middlewares
app.use(cors());
app.use(express.json()); // Para parsear JSON en el body

// rutas
const habitacionRoutes = require('./routes/habitacion.routes');
const reservaRoutes = require('./routes/reserva.routes'); 
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/reservas', reservaRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API del sistema hotelero está funcionando.');
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});