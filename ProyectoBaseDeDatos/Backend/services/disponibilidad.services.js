const Habitacion = require('../models/habitacion.model');
const Reserva = require('../models/reserva.model');

// verificacion de habitacion especifica
exports.estaDisponible = async (habitacionId, fechaEntrada, fechaSalida) => {
  const reservas = await Reserva.find({
    habitacionId,
    fechaEntrada: { $lt: new Date(fechaSalida) },
    fechaSalida: { $gt: new Date(fechaEntrada) },
    estado: { $in: ["confirmada", "check-in"] }
  });
  return reservas.length === 0; 
};

// consultar habitaciones disponibles por tipo y fechas
exports.consultar = async (fechaEntrada, fechaSalida, tipo) => {
  const habitaciones = await Habitacion.find({ tipo });
  const reservas = await Reserva.find({
    fechaEntrada: { $lt: new Date(fechaSalida) },
    fechaSalida: { $gt: new Date(fechaEntrada) },
    estado: { $in: ["confirmada", "check-in"] }
  });
  const ocupadas = reservas.map(r => r.habitacionId.toString());
  return habitaciones.filter(h => !ocupadas.includes(h._id.toString()));
};