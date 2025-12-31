const { SlashCommandBuilder } = require('@discordjs/builders'); // Importa constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Importa embeds para mensajes bonitos
const guildModel = require('../../models/guild.js'); // Importa modelo de BD para servidores

module.exports = {
    data: new SlashCommandBuilder() // Define el comando slash
        .setName('setlang') // Nombre del comando
        .setDescription('Modifica el lenguaje del servidor.') // Descripción
        .addStringOption(option => option.setName('lenguaje').setDescription('Lenguaje del servidor.').setRequired(true).addChoice('Español', 'es').addChoice('English', 'en')), // Opción con elección entre español/inglés
    async run(client, interaction) { // Función ejecutada al usar el comando
        const language = interaction.options._hoistedOptions[0].value; // Obtiene el idioma seleccionado

        if (!interaction.member.permissions.has('ADMINISTRATOR')) { // Verifica si el usuario es administrador
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) }); // Mensaje de error si no tiene permisos
        };

        await guildModel.findOne({ guildId: interaction.guildId.toString() }).then((s, err) => { // Busca el servidor en BD
            if (err) return console.log(err); // Si hay error, lo muestra

            if (s) { // Si el servidor ya existe en BD
                s.lang = language; // Actualiza el idioma
                s.save().catch(e => console.log(e)); // Guarda cambios
            } else { // Si el servidor NO existe en BD
                const newGuild = new guildModel({ // Crea nuevo registro
                    guildId: interaction.guildId.toString(), // ID del servidor
                    lang: language // Idioma seleccionado
                });

                newGuild.save().catch(e => console.log(e)); // Guarda nuevo registro
            };
        });

        const LangEmbed = new MessageEmbed() // Crea embed de confirmación
        .setTimestamp() // Añade marca de tiempo
        .setColor('GREEN') // Color verde (éxito)
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor con avatar
        .setDescription(client.languages.__mf({ phrase: 'lang.newLenguage', locale: language }, { lang: language })) // Descripción traducida
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie con nombre e ícono del servidor
        return interaction.reply({ embeds: [LangEmbed] }); // Envía el embed como respuesta
    }
};