const express = require('express');
const router = express.Router();

const controller = require('../controller/habitacion.controller');


router.get('/', controller.obtenerHabitaciones);
router.post('/', controller.crearHabitacion);
router.put('/:id', controller.actualizarHabitacion);
router.delete('/:id', controller.eliminarHabitacion);
router.get("/capacidad/:capacidad",controller.buscarHabitacionPorCapacidad);
router.get("/disponibles",controller.verDisponibles)
module.exports = router;