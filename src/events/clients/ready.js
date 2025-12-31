const mongoose = require('mongoose'); // ODM para MongoDB
const config = require('../../config/config.json'); // Configuración del bot

module.exports = {
    name: 'ready', // Nombre del evento: cuando el bot se conecta exitosamente a Discord
    async execute(client) { // Función ejecutada cuando el bot está listo
        const guildNum = await client.guilds.cache.size; // Número de servidores donde está el bot
        const memberNum = await client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0); // Total de miembros sumando todos los servidores

        mongoose.connect(config.mongoURL, { // Conecta a la base de datos MongoDB
            useNewUrlParser: true, // Usa nuevo parser de URL
            useUnifiedTopology: true // Usa nueva topología de MongoDB
        });
        
        console.log(`(${client.user.username}) => Conectado || (${guildNum}) => Servidores || (${memberNum}) => Usuarios.`); // Mensaje de éxito en consola
        // Ejemplo: "(Tu Bot Nombre) => Conectado || (50) => Servidores || (10000) => Usuarios."
    }
};