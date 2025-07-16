const Habitacion = require('../models/habitacion.model');
const disponibilidadService = require('../services/disponibilidad.services');
// Obtener todas las habitaciones
exports.obtenerHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();
    res.json(habitaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una nueva habitación
exports.crearHabitacion = async (req, res) => {
  try {
    const habitacion = new Habitacion(req.body);
    await habitacion.save();
    res.status(201).json(habitacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar una habitación existente
exports.actualizarHabitacion = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizada = await Habitacion.findByIdAndUpdate(id, req.body, { new: true });
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una habitación
exports.eliminarHabitacion = async (req, res) => {
  try {
    const { id } = req.params;
    await Habitacion.findByIdAndDelete(id);
    res.json({ mensaje: "Habitación eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//buscar habitacion x capacidad
exports.buscarHabitacionPorCapacidad = async (req, res) => {
  try {
    const { capacidad } = req.params; 
    const habitaciones = await Habitacion.find({ capacidad: { $gte: parseInt(capacidad) } });
    res.json(habitaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verDisponibles = async (req, res) => {
  try {
    const { fechaEntrada, fechaSalida, tipo } = req.query;

    if (!fechaEntrada || !fechaSalida || !tipo) {
      return res.status(400).json({ error: "Debes enviar fechaEntrada, fechaSalida y tipo" });
    }

    const disponibles = await disponibilidadService.consultar(fechaEntrada, fechaSalida, tipo);
    res.json({ disponibles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
