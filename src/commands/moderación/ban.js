const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban') // Comando de ban
        .setDescription('Baneas a un usuario del servidor.')
        .addUserOption(option => option.setName('usuario').setDescription('Usuario al que quieres banear.').setRequired(true)) // Usuario obligatorio
        .addStringOption(option => option.setName('razón').setDescription('Especifica la razón del baneo.')), // Razón opcional
    async run(client, interaction, language) {
        const usermember = interaction.options.getMember('usuario'); // Obtiene el miembro (no solo usuario)
        const razon = interaction.options.getString('razón') || client.languages.__({ phrase: 'ban.breasonNotEspecified', locale: language }); // Razón por defecto si no se especifica

        if (!interaction.member.permissions.has('BAN_MEMBERS')) { // Verifica permiso BAN_MEMBERS
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) });
        };

        if (usermember.roles.highest.position >= interaction.member.roles.highest.position) { // Verifica jerarquía de roles
            return interaction.reply({ content: client.languages.__({ phrase: 'ban.bdonthighest', locale: language }) }); // "No puedes banear a alguien con igual o mayor rol"
        };

        if (!usermember) { // Si no se encontró el miembro
            return interaction.reply({ content: client.languages.__({ phrase: 'utilies.youNeedMention', locale: language }) }); // "Debes mencionar a un usuario"
        };

        await usermember.send({ content: client.languages.__mf({ phrase: 'ban.busermembermd', locale: language }, { server: interaction.guild.name, reason: razon }) }) // MD al usuario baneado

        usermember.ban({ reason: razon }); // Ejecuta el ban

        const banEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__({ phrase: 'moderation.userbanned', locale: language })) // "Usuario baneado correctamente"
        .addField('Usuario Tag:', "```" + `${usermember.user.tag}` + "```", true)
        .addField('Usuario Id:', "```" + `${usermember.user.id}` + "```", true)
        .addField('Razón del ban:', `${razon}`, false) // Muestra la razón
        .setThumbnail(usermember.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // Avatar del baneado
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [banEmbed] });
    }
};