const mongoose =require("mongoose");

const Habitacion=new mongoose.Schema({
    numero: String,
    tipo: String,
    capacidad: Number,
    precioPorNoche: Number,
    amenidades: [String],
    disponible: Boolean
});

module.exports = mongoose.model("Habitacion", Habitacion);