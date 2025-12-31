const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reportbug') // Comando para reportar bugs
        .setDescription('Envia un reporte a los creadores oficiales del bot.')
        .addStringOption(option => option.setName('razón').setDescription('Explica por que quieres enviar el reporte.').setRequired(true)), // Razón obligatoria
    async run(client, interaction, language) {
        const razon = interaction.options.getString('razón'); // Obtiene la razón
        const channel = client.channels.cache.get('889688692988469248'); // Canal FIJADO para reportes (ID específico)

        if (!interaction.member.permissions.has('ADMINISTRATOR')) { // Solo admins pueden reportar
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) });
        };

        const reportBug2Embed = new MessageEmbed() // Embed que se envía AL CANAL DE DESARROLLADORES
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: 'reportbug.messagesend', locale: language }, { reporte: razon }))
        .addField('Guild Id:', "```" + `${interaction.guild.id}` + "```", false) // ID del servidor en bloque de código
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        await channel.send({ embeds: [reportBug2Embed] }); // Envía al canal de devs

        const reportBugEmbed = new MessageEmbed() // Embed que se muestra AL USUARIO
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: 'reportbug.messagecorrect', locale: language }, { reporte: razon })) // Confirmación
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [reportBugEmbed] }); // Responde al usuario
    }
};