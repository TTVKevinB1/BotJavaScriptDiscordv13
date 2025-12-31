const guildModel = require('../models/guild.js'); // Modelo de BD para servidores

module.exports = async (client, interaction) => { // Función principal que ejecuta comandos
    const command = client.commands.get(interaction.commandName); // Busca el comando por nombre en la colección

    if (!command) return; // Si no existe el comando, termina

    const Guild = interaction.member.guild; // Obtiene objeto del servidor

    await guildModel.findOne({ // Busca configuración del servidor en BD
        guildId: interaction.guildId // Por ID del servidor
    }).then((s, err) => {
        if (err) return console.log(err); // Si hay error, lo muestra

        if (s) { // Si el servidor existe en BD
            Guild.lang = s.lang; // Asigna el idioma guardado al objeto del servidor
        } else { // Si el servidor NO existe en BD
            const newGuild = new guildModel({ // Crea nuevo registro
                guildId: interaction.guildId.toString(), // ID como string
                lang: 'es' // Idioma por defecto: español
            });

            newGuild.save().catch(e => console.log(e)); // Guarda en BD
        };
    });

    try {
        const language = interaction.member.guild.lang; // Obtiene idioma del servidor (ya asignado arriba)
        await command.run(client, interaction, language); // Ejecuta el comando pasando idioma como parámetro
    } catch (e) {
        console.error(e); // Si hay error al ejecutar comando, lo muestra en consola
    };
};