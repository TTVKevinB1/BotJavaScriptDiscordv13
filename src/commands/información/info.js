const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info') // Información del bot
        .setDescription('Revisa la información general del bot.'),
    async run(client, interaction, language) {
        const infoEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__({ phrase: 'info.infogeneral', locale: language })) // Descripción general
        .addField('Invitación Discord de Soporte:', `[Discord Invite](https://discord.gg/TuInv 'Invitación Discord de Soporte')`, false) // Link con tooltip
        .addField('Invitación Bot Neutro Universe:', `[Invite Bot Link](https://discord.com/api/oauth2/authorize?client_id=[ID-de-tu-BOT]&permissions=8&scope=applications.commands%20bot 'Invitación Bot')`, false) // Link para invitar bot
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Miniatura con avatar del usuario
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [infoEmbed] });
    }
};