const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // Comando de latencia
        .setDescription('Revisa la latencia del bot.'),
    async run(client, interaction, language) {
        const pingEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__({ phrase: 'ping.info', locale: language })) // Descripción traducida
        .addField('BOT Ping:', "```" + `${Math.round(client.ws.ping)} Ms` + "```", true) // Ping redondeado en ms
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'png' }))
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [pingEmbed] });
    }
};