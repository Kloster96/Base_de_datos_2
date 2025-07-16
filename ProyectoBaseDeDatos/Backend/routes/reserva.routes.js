const express =require("express");
const router = express.Router();
const controller = require("../controller/reserva.controller");

router.get("/",controller.obtenerReservas);
router.get("/:id",controller.obtenerReservaPorId);
router.post("/",controller.crearReserva);//no me crea mas de una reserva?
router.delete("/:id",controller.eliminarReserva);
router.put("/:id",controller.actualizarReserva);//no cambia x si solo
router.put("/cancelar/:id",controller.cancelarReserva);
router.put("/checkin/:id",controller.checkIn);//no cambia estado de la habitacion
router.get("/reporte/:mes/:anio",controller.reporteOcupacion)

module.exports=router;