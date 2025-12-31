const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say') // Comando para "decir" algo
        .setDescription('Mandas un mensaje roleando.')
        .addStringOption(option => option.setName('contenido').setDescription('Escribe lo que haces, rolea con tus amigos.').setRequired(true)), // Contenido obligatorio
    async run(client, interaction, language) {
        const contenido = interaction.options.getString('contenido'); // Obtiene el texto

        const sayEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('RANDOM') // Color aleatorio
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: 'say.dicho', locale: language }, { contenido: contenido })) // Muestra el contenido en embed
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [sayEmbed] });
    }
};