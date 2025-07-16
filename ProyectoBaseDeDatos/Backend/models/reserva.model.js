const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  habitacionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitacion', 
    required: true
  },
  huesped: {
    nombre: String,
    email: String,
    telefono: String
  },
  fechaEntrada: Date,
  fechaSalida: Date,
  noches: Number,
  precioTotal: Number,
  estado: String,
  fechaReserva: Date
});

module.exports = mongoose.model('Reserva', reservaSchema);