const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost/hotelSystem', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1); // Salir si no se conecta
  }
};

module.exports = connectDB;