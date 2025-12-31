const mongoose = require('mongoose'); // ODM para MongoDB

const model = new mongoose.Schema({ // Define esquema de MongoDB
    guildId: { type: String }, // ID del servidor (Discord)
    lang: { type: String }, // Idioma del servidor ('es' o 'en')
    logs: { type: String } // ID del canal de logs
}, { collection: 'Guilds' }); // Especifica nombre de la colección en MongoDB

module.exports = mongoose.model('Guilds', model); // Exporta modelo para usar en otros archivos