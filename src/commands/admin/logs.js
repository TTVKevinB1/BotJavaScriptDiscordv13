const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guildModel = require('../../models/guild.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogs') // Nombre: setlogs
        .setDescription('Modifica el canal de logs.') // Descripción
        .addChannelOption(option => option.setName('canal').setDescription('Ingresa el canal para los logs.').setRequired(true)), // Opción de canal obligatoria
    async run(client, interaction, language) { // Recibe lenguaje como parámetro
        const logs = interaction.options.getChannel('canal'); // Obtiene el canal seleccionado

        if (!interaction.member.permissions.has('ADMINISTRATOR')) { // Verifica permisos de admin
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) });
        };

        await guildModel.findOne({ guildId: interaction.guildId.toString() }).then((s, err) => { // Busca servidor en BD
            if (err) return console.log(err);

            if (s) { // Si existe
                s.logs = logs.id; // Actualiza ID del canal de logs
                s.save().catch(e => console.log(e));
            } else { // Si no existe
                const newGuild = new guildModel({
                    guildId: interaction.guildId.toString(),
                    logs: logs.id // Solo guarda el canal de logs
                });

                newGuild.save().catch(e => console.log(e));
            };
        });

        const LogsEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: 'logs.correct', locale: language }, { channel: logs.name })) // Menciona el canal configurado
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [LogsEmbed] });
    }
};