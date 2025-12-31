const { MessageEmbed } = require('discord.js'); // Embeds para mensajes
const guildModel = require('../../models/guild.js'); // Modelo de BD para servidores

module.exports = {
    name: 'messageDelete', // Nombre del evento: cuando se borra un mensaje
    async execute(message, client) { // Función ejecutada cuando se borra un mensaje
        const lc = await guildModel.findOne({ guildId: message.guildId.toString() }); // Busca configuración del servidor en BD

        if (!lc) return; // Si no hay configuración (no tiene logs configurados), no hace nada

        const messageDEmbed = new MessageEmbed() // Crea embed para registrar el mensaje borrado
        .setColor('RED') // Color rojo (para eventos negativos/eliminación)
        //.setDescription(client.languages.__({ phrase: 'eventMessageDelete.TitleBorrado', locale: language })) // Línea comentada: título traducido
        .addField('Mensaje borrado:', "```" + `${message.content}` + "```", false) // Contenido del mensaje en bloque de código
        .addField('En el canal:', `${message.channel}`, true) // Menciona el canal donde estaba
        .addField('Id del canal:', `${message.channel.id}`, true) // ID del canal

        client.channels.resolve(lc.logs).send({ embeds: [messageDEmbed] }); // Envía el embed al canal de logs configurado
        // Nota: lc.logs contiene el ID del canal de logs guardado en BD
    }
};