const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock') // Bloquear canal
        .setDescription('Bloqueas el escribir en un canal.'),
    async run(client, interaction, language) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) { // Permiso para gestionar mensajes
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) });
        };

        interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { // Modifica permisos del rol @everyone
            SEND_MESSAGES: false, // Desactiva enviar mensajes
        });

        const lockEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: 'moderation.lockchannel', locale: language })) // "Canal bloqueado correctamente"
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        await interaction.reply({ embeds: [lockEmbed] });
    }
};