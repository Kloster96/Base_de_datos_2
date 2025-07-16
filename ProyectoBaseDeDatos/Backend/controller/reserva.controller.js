const Reserva = require("../models/reserva.model");
const Habitacion = require("../models/habitacion.model");
const disponibilidad = require("../services/disponibilidad.services");

//lista de reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().populate("habitacionId");
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//crear reserva
exports.crearReserva = async (req, res) => {
  try {
    const { fechaEntrada, fechaSalida, habitacionId, huesped } = req.body;

    // validacion habitacion especifica
    const disponible = await disponibilidad.estaDisponible(habitacionId, fechaEntrada, fechaSalida);
    if (!disponible) {
      return res.status(400).json({ error: "Habitación no disponible en ese rango de fechas" });
    }

    const noches = Math.ceil((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24));
    const habitacion = await Habitacion.findById(habitacionId);
    const precioTotal = noches * habitacion.precioPorNoche;

    const reserva = new Reserva({
      habitacionId,
      huesped,
      fechaEntrada,
      fechaSalida,
      noches,
      precioTotal,
      estado: "confirmada",
      fechaReserva: new Date()
    });

    await reserva.save();
    res.status(201).json(reserva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id).populate('habitacionId');
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.actualizarReserva = async (req, res) => {
  try {
    const reservaActual = await Reserva.findById(req.params.id);
    if (!reservaActual) return res.status(404).json({ error: "Reserva no encontrada" });

    const { fechaEntrada, fechaSalida } = req.body;

    let noches = reservaActual.noches;
    let precioTotal = reservaActual.precioTotal;

    // si modifico las fechas modifico las noches y total de $$
    if (fechaEntrada && fechaSalida) {
      noches = Math.ceil((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24));
      const habitacion = await Habitacion.findById(reservaActual.habitacionId);
      precioTotal = noches * habitacion.precioPorNoche;
    }

    const actualizada = await Reserva.findByIdAndUpdate(
      req.params.id,
      { ...req.body, noches, precioTotal },
      { new: true }
    );

    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.eliminarReserva = async (req, res) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Reserva eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, { estado: "cancelada" }, { new: true });
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.checkIn = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, { estado: "check-in" }, { new: true });
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reporteOcupacion = async (req, res) => {
  try {
    const { mes, anio } = req.params;
    const mesNum = parseInt(mes);
    const anioNum = parseInt(anio);
    if (isNaN(mesNum) || isNaN(anioNum)) {
      return res.status(400).json({ error: "Mes y anio deben ser numéricos" });
    }

    const inicio = new Date(anioNum, mesNum - 1, 1);
    const fin = new Date(anioNum, mesNum, 0, 23, 59, 59);

    const reservas = await Reserva.find({
      estado: { $in: ["confirmada", "check-in"] },
      fechaEntrada: { $lte: fin },
      fechaSalida: { $gte: inicio }
    });

    const totalNoches = reservas.reduce((sum, r) => sum + r.noches, 0);
    res.json({ totalReservas: reservas.length, totalNoches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
