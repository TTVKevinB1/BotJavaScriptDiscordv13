const { SlashCommandBuilder } = require('@discordjs/builders'); // Constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Embeds para mensajes

module.exports = {
    data: new SlashCommandBuilder() // Define comando slash
        .setName('unlock') // Nombre: unlock
        .setDescription('Desbloqueas el escribir en un canal.'), // Descripción
    async run(client, interaction, language) { // Función ejecutada al usar comando
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) { // Verifica permiso MANAGE_MESSAGES
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) }); // "No tienes permisos"
        };

        interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { // Modifica permisos del rol @everyone en este canal
            SEND_MESSAGES: true, // Activa el permiso para enviar mensajes (lo contrario de /lock)
        });

        const lockEmbed = new MessageEmbed() // Crea embed de confirmación (nota: variable se llama "lockEmbed" pero es para unlock)
        .setTimestamp() // Marca de tiempo
        .setColor('GREEN') // Color verde
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: quien ejecutó el comando
        .setDescription(client.languages.__mf({ phrase: 'moderation.unlockchannel', locale: language })) // "Canal desbloqueado correctamente"
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
        await interaction.reply({ embeds: [lockEmbed] }); // Envía embed (nota: debería llamarse unlockEmbed para consistencia)
    }
};