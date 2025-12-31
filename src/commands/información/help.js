const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help') // Comando de ayuda
        .setDescription('Revisa la información general del bot.'),
    async run(client, interaction, language) {
        const helpEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__({ phrase: 'help.infos', locale: language })) // Descripción traducida
        .addField('Comandos Administrativos:', "```" + `/setlang, /setlogs, /reportbug` + "```", false) // Lista en bloque de código
        .addField('Comandos Información:', "```" + `/help, /status, /info, /ping` + "```", false)
        .addField('Comandos Juegos:', "```" + `/chess, /poker, /betrayal` + "```", false)
        .addField('Comandos Diversión:', "```" + `/say, /8ball` + "```", false)
        .addField('Comandos Utilidades:', "```" + `/avatar, /youtube` + "```", false)
        .addField('Comandos Moderación:', "```" + `/clear, /userinfo, /ban, /kick, /unban, /lock, /unlock` + "```", false)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'png' })) // Miniatura con ícono del servidor
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        await interaction.reply({ embeds: [helpEmbed] });
    }
};